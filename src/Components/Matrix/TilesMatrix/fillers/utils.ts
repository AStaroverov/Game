import { uniq } from 'lodash';

export type ProbabilityRecord = Record<string, number>;

export function sumProbabilities<T extends ProbabilityRecord>(a: T, b: T): T {
    const r: ProbabilityRecord = {};
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    uniq([...keysA, ...keysB]).forEach((key) => {
        r[key] = (a[key] ?? 0) + (b[key] ?? 0);
    });

    return r as T;
}

export const getFromProbabilities =
    (rand: () => number) =>
    <T extends ProbabilityRecord>(probabilities: T): keyof T => {
        const num = rand();
        const entries = Object.entries(probabilities).sort(
            ([, a], [, b]) => a - b,
        );
        const index = entries
            .map(([, v]) => v)
            .map((v, i, arr) => v + (arr[i - 1] ?? 0))
            .findIndex((prob) => prob >= num);

        return entries[index][0];
    };
