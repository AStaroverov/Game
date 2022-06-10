import { uniq } from 'lodash';

import { Matrix, TMatrix } from '../../../../../utils/Matrix';
import { random } from '../../../../../utils/random';

export type ProbabilityRecord = Record<string, number>;

export function getProbabilityRecord<T>(
    getProbabilities: (item: T) => undefined | ProbabilityRecord,
) {
    return function _getProbabilityRecord(
        matrix: TMatrix<T>,
    ): ProbabilityRecord {
        return Matrix.reduce(matrix, {} as ProbabilityRecord, (acc, item) => {
            const newProbabilities = getProbabilities(item);
            return newProbabilities === undefined
                ? acc
                : sumProbabilities(acc, newProbabilities);
        });
    };
}

export function normalizeProbabilities(
    probabilities: ProbabilityRecord,
): ProbabilityRecord {
    const keys = Object.keys(probabilities);
    const sum = keys.reduce((s, k) => s + probabilities[k], 0);
    const ratio = 1 / sum;

    return sum === 0
        ? probabilities
        : keys.reduce((acc, key) => {
              acc[key] = ratio * probabilities[key];
              return acc;
          }, {} as ProbabilityRecord);
}

export function getRandomProbability<T extends ProbabilityRecord>(
    probabilities: T,
): keyof T {
    const num = random();
    const entries = Object.entries(probabilities).sort(([, a], [, b]) => a - b);
    const index = entries
        .map(([, v]) => v)
        .map((v, i, arr) => v + (arr[i - 1] ?? 0))
        .findIndex((prob) => prob >= num);

    return entries[index][0];
}

export function sumProbabilities<T extends ProbabilityRecord>(a: T, b: T): T {
    const r: ProbabilityRecord = {};
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    uniq([...keysA, ...keysB]).forEach((key) => {
        r[key] = (a[key] ?? 0) + (b[key] ?? 0);
    });

    return r as T;
}
