import { uniq } from 'lodash';
import { pipe } from 'lodash/fp';

import Enumerable from '../../../../lib/linq';
import { Item, radialIterate } from '../../../utils/Matrix/radialIterate';
import { Tile, TileSubtype, TileType } from './def';
import { TilesMatrix, updateTile } from './index';

export function fillEmptyTiles({ matrix }: TilesMatrix): void {
    Enumerable.from(
        radialIterate(
            matrix,
            Math.floor(matrix.h / 2),
            Math.floor(matrix.w / 2),
        ),
    )
        .where(
            (item): item is Item<Tile> => item?.value.type === TileType.empty,
        )
        .forEach(({ value, x, y }) => {
            const summedProbabilities = Enumerable.from(
                radialIterate(matrix, x, y, 1),
            )
                .skip(1)
                .where((item): item is Item<Tile> => item !== undefined)
                .scan({} as ProbabilityRecord, (acc, { value }) => {
                    return sumProbabilities(acc, tileProbabilities[value.type]);
                })
                .last();

            const type = pipe(
                (probabilities: ProbabilityRecord): ProbabilityRecord => {
                    const keys = Object.keys(probabilities);
                    const sum = keys.reduce((s, k) => s + probabilities[k], 0);
                    const ratio = 1 / sum;

                    return sum === 0
                        ? probabilities
                        : keys.reduce((acc, key) => {
                              acc[key] = ratio * probabilities[key];
                              return acc;
                          }, {} as ProbabilityRecord);
                },
                getFromProbabilities(Math.random),
            )(summedProbabilities);

            updateTile(value, {
                type: type as TileType,
                subtype: TileSubtype.gross,
            });
        });
}

type ProbabilityRecord<T extends string = string> = Record<T, number>;
const tileProbabilities: Record<
    TileType,
    Partial<ProbabilityRecord<TileType>>
> = {
    [TileType.empty]: {
        [TileType.passable]: 0,
        [TileType.impassable]: 0,
    },
    [TileType.passable]: {
        [TileType.passable]: 0.97,
        [TileType.impassable]: 0.03,
    },
    [TileType.impassable]: {
        [TileType.passable]: 0.15,
        [TileType.impassable]: 0.85,
    },
};

function sumProbabilities<T extends ProbabilityRecord>(a: T, b: T): T {
    const r: ProbabilityRecord = {};
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    uniq([...keysA, ...keysB]).forEach((key) => {
        r[key] = (a[key] ?? 0) + (b[key] ?? 0);
    });

    return r as T;
}

const getFromProbabilities =
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
