import { Matrix } from '../../utils/matrix';

export enum ETileType {
    empty = 'empty',
    passable = 'passable',
    impassable = 'impassable',
}
export type TTile = {
    type: ETileType;
    interactive: boolean;
    color: number;
};

const GET_EMPTY_TILE = () => ({
    type: ETileType.empty,
    interactive: false,
    color: 0xffffff,
});

export class Card {
    n: number;
    m: number;
    offset = { x: 0, y: 0 };

    private tiles: Matrix<TTile>;

    constructor(options: { n: number; m: number }) {
        this.n = options.n;
        this.m = options.n;
        this.tiles = fillEmptyTiles(
            new Matrix<TTile>(this.n, this.m, GET_EMPTY_TILE),
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
        const { n, m } = this;
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
            item.type =
                Math.random() > 0.3 ? ETileType.passable : ETileType.impassable;
            item.color = getTileColor(item.type);
        }
    });

    return tiles;
}

function getTileColor(type: ETileType): number {
    switch (type) {
        case ETileType.passable:
            return 0x03ac12;
        case ETileType.impassable:
            return 0x000000;
        default:
            return 0xffffff;
    }
}
