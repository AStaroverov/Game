import { shuffle } from 'lodash';

import { TMatrix } from '../../index';
import { get } from '../base';
import { STOP_ITERATE } from '../utils';
import { createEvery, createFind, createMany, createMap, createReduce, createSome } from './create';

const NUMBERS = new Int32Array(1_000_000).map((_, i) => i);

export function shuffleForEach<T>(
    matrix: TMatrix<T>,
    callback: (item: T, x: number, y: number, i: number) => unknown,
): boolean {
    let index = 0;
    const xs = shuffle(NUMBERS.subarray(0, matrix.w));

    for (let i = 0; i < xs.length; i++) {
        const x = xs[i];
        const ys = shuffle(NUMBERS.subarray(0, matrix.h));

        for (let i = 0; i < ys.length; i++) {
            const y = ys[i];
            const item = get(matrix, x, y)!;

            if (callback(item, x, y, index++) === STOP_ITERATE) {
                return true;
            }
        }
    }

    return false;
}

export const shuffleReduce = createReduce(shuffleForEach);
export const shuffleFind = createFind(shuffleForEach);
export const shuffleSome = createSome(shuffleForEach);
export const shuffleMany = createMany(shuffleForEach);
export const shuffleEvery = createEvery(shuffleForEach);
export const shuffleMap = createMap(shuffleForEach);
