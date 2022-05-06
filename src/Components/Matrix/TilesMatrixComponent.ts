import { uniq } from 'lodash';
import { pipe } from 'lodash/fp';

import { hasComponent } from '../../../lib/ECS/entities';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { Matrix } from '../../utils/Matrix';
import { Item, radialForEach } from '../../utils/Matrix/utils';
import { Size, Vector } from '../../utils/shape';
import { MatrixComponent } from './MatrixComponent';

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

export class TilesMatrixComponent extends MatrixComponent<Tile> {
    constructor(props: Size) {
        super({ ...props, seed: GET_EMPTY_TILE });
    }
}

export function hasTilesComponent(
    entity: Entity,
): entity is Entity<TilesMatrixComponent> {
    return hasComponent(entity, TilesMatrixComponent);
}

export function tilesInit(
    { matrix }: TilesMatrixComponent,
    x: number,
    y: number,
): void {
    matrix.set(x, y, { type: TileType.passable });
}

export function tilesMove({ matrix }: TilesMatrixComponent, v: Vector): void {
    const { w, h } = matrix;
    const tmp = new Matrix<Tile>(w, h, GET_EMPTY_TILE);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const prevTile = matrix.get(i + v.x, j + v.y);
            prevTile && tmp.set(i, j, prevTile);
        }
    }

    matrix.setSource(tmp.buffer.slice());
}

export function tilesFillEmpty({ matrix }: TilesMatrixComponent): void {
    Enumerable.from(
        radialForEach(
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
                radialForEach(matrix, x, y, 1),
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
    <T extends ProbabilityRecord>(probs: T): keyof T => {
        const num = rand();
        const entries = Object.entries(probs).sort(([, a], [, b]) => a - b);
        const index = entries
            .map(([, v]) => v)
            .map((v, i, arr) => v + (arr[i - 1] ?? 0))
            .findIndex((prob) => prob >= num);

        return entries[index][0];
    };
