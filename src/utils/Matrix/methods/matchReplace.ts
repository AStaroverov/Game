import { TMatrix } from '../index';
import { create, every, forEach, many, set, some } from './base';
import { getItem, Item } from './utils';

export type ItemMatchReplace<T> = {
    match: (item: Item<T>) => boolean;
    replace?: (item: Item<T>, matchedMatrix: TMatrix<T>) => T;
};
export function matchReplace<T>(
    matrix: TMatrix<T>,
    matchReplaces: TMatrix<ItemMatchReplace<T>>[],
): boolean {
    return some(matrix, (item, x, y) => {
        return matchReplaces.some(createSomeReplaced(matrix, x, y));
    });
}
export function matchReplaceAll<T>(
    matrix: TMatrix<T>,
    matchReplaces: TMatrix<ItemMatchReplace<T>>[],
): boolean {
    return many(matrix, (item, x, y) => {
        return matchReplaces.some(createSomeReplaced(matrix, x, y));
    });
}

export function createSomeReplaced<T>(
    matrix: TMatrix<T>,
    sx: number,
    sy: number,
) {
    return function someReplaced(
        matchReplace: TMatrix<ItemMatchReplace<T>>,
    ): boolean {
        if (sx + matchReplace.w > matrix.w || sy + matchReplace.h > matrix.h) {
            return false;
        }

        const matchedItems: Item<T>[] = [];
        const matched = every(matchReplace, ({ match }, x, y, i) => {
            return match((matchedItems[i] = getItem(matrix, sx + x, sy + y)));
        });

        if (matched) {
            const matchedMatrix = create<T>(
                matchReplace.w,
                matchReplace.h,
                (x, y, i) => matchedItems[i].value!,
            );
            forEach(matchReplace, ({ replace }, x, y, i) => {
                set(
                    matrix,
                    sx + x,
                    sy + y,
                    replace === undefined
                        ? matchedItems[i].value
                        : replace(matchedItems[i], matchedMatrix),
                );
            });

            return true;
        }

        return false;
    };
}
