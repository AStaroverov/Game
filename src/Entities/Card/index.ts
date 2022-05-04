import { uniq } from 'lodash';
import { pipe } from 'lodash/fp';

import Enumerable from '../../../lib/linq';
import { Matrix } from '../../utils/Matrix';
import { Item, radialForEach } from '../../utils/Matrix/utils';

export enum ETileType {
    empty = 'empty',
    passable = 'passable',
    impassable = 'impassable',
}
export type Tile = {
    type: ETileType;
};

const GET_EMPTY_TILE = (): Tile => ({
    type: ETileType.empty,
});

export class Card {
    n: number;
    m: number;
    offset = { x: 0, y: 0 };

    private tiles: Matrix<Tile>;

    constructor(options: { n: number; m: number; sx: number; sy: number }) {
        this.n = options.n;
        this.m = options.n;
        this.tiles = fillEmptyTiles(
            new Matrix<Tile>(this.n, this.m, GET_EMPTY_TILE).set(
                options.sy,
                options.sy,
                { type: ETileType.passable },
            ),
        );
    }

    getTile(x: number, y: number): undefined | Tile {
        return this.tiles.get(x, y);
    }

    getSlice(x: number, y: number, r: number): Matrix<undefined | Tile> {
        x -= this.offset.x;
        y -= this.offset.y;

        const slice = new Matrix<undefined | Tile>(
            r * 2 + 1,
            r * 2 + 1,
            GET_EMPTY_TILE,
        );

        for (let i = -r; i <= r; i++) {
            for (let j = -r; j <= r; j++) {
                slice.set(r + i, r + j, this.tiles.get(x + i, y + j));
            }
        }

        return slice;
    }

    move(x: number, y: number): void {
        const { n, m } = this;
        const dX = -x;
        const dY = -y;
        const tiles = new Matrix<Tile>(n, m, GET_EMPTY_TILE);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const prevTile = this.tiles.get(i + dX, j + dY);
                prevTile && tiles.set(i, j, prevTile);
            }
        }

        this.offset.x += dX;
        this.offset.y += dY;
        this.tiles = fillEmptyTiles(tiles);
    }
}

function fillEmptyTiles(tiles: Matrix<Tile>): Matrix<Tile> {
    Enumerable.from(
        radialForEach(tiles, Math.floor(tiles.m / 2), Math.floor(tiles.n / 2)),
    )
        .skip(1)
        .where(
            (item): item is Item<Tile> => item?.value.type === ETileType.empty,
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

            value.type = type as ETileType;
        });

    return tiles;
}

type ProbabilityRecord<T extends string = string> = Record<T, number>;
const tileProbabilities: Record<ETileType, ProbabilityRecord<ETileType>> = {
    [ETileType.empty]: {
        [ETileType.empty]: 0,
        [ETileType.passable]: 0,
        [ETileType.impassable]: 0,
    },
    [ETileType.passable]: {
        [ETileType.empty]: 0,
        [ETileType.passable]: 0.97,
        [ETileType.impassable]: 0.03,
    },
    [ETileType.impassable]: {
        [ETileType.empty]: 0,
        [ETileType.passable]: 0.15,
        [ETileType.impassable]: 0.85,
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
