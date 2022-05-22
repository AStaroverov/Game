import { uniq } from 'lodash';
import { pipe } from 'lodash/fp';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';
import Enumerable from '../../../lib/linq';
import { Matrix } from '../../utils/Matrix';
import { Item, radialIterate } from '../../utils/Matrix/radialIterate';
import { Size, Vector } from '../../utils/shape';
import { createMatrixComponent } from './Matrix';

export enum TileType {
    empty = 'empty',
    passable = 'passable',
    impassable = 'impassable',
}

export type Tile = {
    type: TileType;
};

const GET_EMPTY_TILE = (): Tile => ({
    type: TileType.empty,
});

export const TilesMatrixID = 'TILES_MATRIX' as const;
export type TilesMatrix = ReturnStruct<typeof createTilesMatrixComponent>;
export const createTilesMatrixComponent = (props: Size) =>
    createComponent(
        TilesMatrixID,
        createMatrixComponent({ ...props, seed: GET_EMPTY_TILE }),
    );

export function tilesInit(struct: TilesMatrix, x: number, y: number): void {
    if (Matrix.get(struct.matrix, x, y).type === TileType.empty) {
        Matrix.set(struct.matrix, x, y, { type: TileType.passable });
    }

    tilesFillEmpty(struct);
}

export function tilesMove({ matrix }: TilesMatrix, v: Vector): void {
    const { w, h } = matrix;
    const tmp = Matrix.create<Tile>(w, h, GET_EMPTY_TILE);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const prevTile = Matrix.get(matrix, i + v.x, j + v.y);
            prevTile && Matrix.set(tmp, i, j, prevTile);
        }
    }

    Matrix.setSource(matrix, tmp.buffer.slice());
}

export function tilesFillEmpty({ matrix }: TilesMatrix): void {
    Enumerable.from(
        radialIterate(
            matrix,
            Math.floor(matrix.h / 2),
            Math.floor(matrix.w / 2),
        ),
    )
        .skip(1)
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

            value.type = type as TileType;
        });
}

type ProbabilityRecord<T extends string = string> = Record<T, number>;
const tileProbabilities: Record<TileType, ProbabilityRecord<TileType>> = {
    [TileType.empty]: {
        [TileType.empty]: 0,
        [TileType.passable]: 0,
        [TileType.impassable]: 0,
    },
    [TileType.passable]: {
        [TileType.empty]: 0,
        [TileType.passable]: 0.97,
        [TileType.impassable]: 0.03,
    },
    [TileType.impassable]: {
        [TileType.empty]: 0,
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
