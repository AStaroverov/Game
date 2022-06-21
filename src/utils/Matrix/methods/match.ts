import { some as arraySome } from 'lodash';

import { TMatrix } from '../index';
import { create, get } from './base';
import { every, many, some } from './iterators/base';
import { shuffleMany, shuffleSome } from './iterators/shuffle';

export type ItemMatch<T> = {
    match: (item: T, x: number, y: number, matrix: TMatrix<T>) => boolean;
};

export const match: <T>(matrix: TMatrix<T>, matches: TMatrix<ItemMatch<T>>[]) => TMatrix<T>[] =
    createMatch();

export const matchAll: <T>(matrix: TMatrix<T>, matches: TMatrix<ItemMatch<T>>[]) => TMatrix<T>[] =
    createMatch(many);

export const matchShuffle: <T>(
    matrix: TMatrix<T>,
    matches: TMatrix<ItemMatch<T>>[],
) => TMatrix<T>[] = createMatch(shuffleSome);

export const matchShuffleAll: <T>(
    matrix: TMatrix<T>,
    matches: TMatrix<ItemMatch<T>>[],
) => TMatrix<T>[] = createMatch(shuffleMany);

export function createMatch(matrixIterator = some, matchIterator = arraySome) {
    return function match<T>(
        matrix: TMatrix<T>,
        targetMatrices: TMatrix<ItemMatch<T>>[],
    ): TMatrix<T>[] {
        const peaces: TMatrix<T>[] = [];

        matrixIterator(matrix, (item, x, y) => {
            const matcher = createMatcher(matrix, x, y);
            return matchIterator(targetMatrices, (target) => {
                const peace = matcher(target);
                return peace !== undefined ? (peaces.push(peace), true) : false;
            });
        });

        return peaces;
    };
}

export function createMatcher<T>(matrix: TMatrix<T>, sx: number, sy: number) {
    return function matcher(targetMatrix: TMatrix<ItemMatch<T>>): undefined | TMatrix<T> {
        if (sx + targetMatrix.w > matrix.w || sy + targetMatrix.h > matrix.h) {
            return undefined;
        }

        const matchedItems: T[] = [];
        const matched = every(targetMatrix, ({ match }, x, y, i) => {
            return match(
                (matchedItems[i] = get(matrix, sx + x, sy + y) as T),
                sx + x,
                sy + y,
                matrix,
            );
        });

        return matched
            ? create<T>(targetMatrix.w, targetMatrix.h, (x, y, i) => matchedItems[i]!)
            : undefined;
    };
}
