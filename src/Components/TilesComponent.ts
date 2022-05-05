import { uniq } from 'lodash';
import { pipe } from 'lodash/fp';

import { createComponent } from '../../lib/ECS/components';
import Enumerable from '../../lib/linq';
import { Matrix } from '../utils/Matrix';
import { Item, radialForEach } from '../utils/Matrix/utils';
import { newSize, Size } from '../utils/shape';

export enum TileType {
    empty = 'empty',
    passable = 'passable',
    impassable = 'impassable',
}

export type Tile = {
    type: TileType;
};

export type Tiles = Matrix<Tile>;

const GET_EMPTY_TILE = (): Tile => ({
    type: TileType.empty,
});

export const TilesComponent = createComponent(
    (props: { w: number; h: number; sx: number; sy: number }) => {
        return fillEmptyTiles(
            new Matrix<Tile>(props.w, props.h, GET_EMPTY_TILE).set(
                props.sx,
                props.sy,
                { type: TileType.passable },
            ),
        );
    },
);

export function getSize(tiles: Tiles): Size {
    return newSize(tiles.n, tiles.m);
}

export function getTile(tiles: Tiles, x: number, y: number): undefined | Tile {
    return tiles.get(x, y);
}

export function getSlice(
    tiles: Tiles,
    x: number,
    y: number,
    r: number,
): Matrix<undefined | Tile> {
    const slice = new Matrix<undefined | Tile>(
        r * 2 + 1,
        r * 2 + 1,
        GET_EMPTY_TILE,
    );

    for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
            slice.set(r + i, r + j, tiles.get(x + i, y + j));
        }
    }

    return slice;
}

export function tilesMove(tiles: Tiles, dx: number, dy: number): void {
    const { n, m } = tiles;
    const tmp = new Matrix<Tile>(n, m, GET_EMPTY_TILE);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const prevTile = tiles.get(i + dx, j + dy);
            prevTile && tmp.set(i, j, prevTile);
        }
    }

    tiles.setSource(tmp.buffer.slice());
}

function fillEmptyTiles(tiles: Matrix<Tile>): Matrix<Tile> {
    Enumerable.from(
        radialForEach(tiles, Math.floor(tiles.m / 2), Math.floor(tiles.n / 2)),
    )
        .skip(1)
        .where(
            (item): item is Item<Tile> => item?.value.type === TileType.empty,
        )
        .forEach(({ value, x, y }) => {
            const summedProbabilities = Enumerable.from(
                radialForEach(tiles, x, y, 1),
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

    return tiles;
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