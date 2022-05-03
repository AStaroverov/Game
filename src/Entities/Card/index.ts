import { defaults } from 'lodash';

import { Matrix } from '../../utils/matrix';

export enum ETileType {
    empty,
    road,
    item,
}
export type TTile = {
    type: ETileType;
    interactive: boolean;
    color: number;
};

export type TOptions = {
    n: number;
    m: number;
};

const DEFAULT_OPTIONS = {
    n: 10,
    m: 10,
};

const GET_EMPTY_TILE = () => ({
    type: ETileType.empty,
    interactive: false,
    color: 0xffffff,
});

export class Card {
    offset = { x: 0, y: 0 };

    private options: TOptions;
    private tiles: Matrix<TTile>;

    constructor(options: { n: number; m: number }) {
        this.options = defaults(DEFAULT_OPTIONS, options);
        this.tiles = fillEmptyTiles(
            new Matrix<TTile>(this.options.n, this.options.m, GET_EMPTY_TILE),
        );
    }

    getTile(x: number, y: number): TTile {
        return this.tiles.get(x, y);
    }

    getSlice(x: number, y: number, r: number): Matrix<TTile> {
        x -= this.offset.x;
        y -= this.offset.y;

        const slice = new Matrix<TTile>(r * 2 + 1, r * 2 + 1, GET_EMPTY_TILE);

        for (let i = -r; i <= r; i++) {
            for (let j = -r; j <= r; j++) {
                slice.set(r + i, r + j, this.tiles.get(x + i, y + j));
            }
        }

        return slice;
    }

    move(x: number, y: number): void {
        const { n, m } = this.options;
        const dX = -x;
        const dY = -y;
        const tiles = new Matrix<TTile>(n, m, GET_EMPTY_TILE);

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

function fillEmptyTiles(tiles: Matrix<TTile>): Matrix<TTile> {
    tiles.forEach((item) => {
        if (item.type === ETileType.empty) {
            item.type = ETileType.road;
            item.color = 0xffffff * Math.random();
        }
    });

    return tiles;
}
