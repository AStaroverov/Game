import { createComponent, ReturnStruct } from '../../../../lib/ECS/Component';
import { Matrix, TMatrix } from '../../../utils/Matrix';
import { Size, Vector } from '../../../utils/shape';
import { createMatrixComponent } from '../Matrix';
import { Tile, TileEnv, TileSubtype, TileType } from './def';
import { fillEmptyTiles } from './fill';

const GET_EMPTY_TILE = (): Tile => ({
    env: TileEnv.Forest,
    type: TileType.empty,
    subtype: TileSubtype.empty,
});

export const TilesMatrixID = 'TILES_MATRIX' as const;
export type TilesMatrix = ReturnStruct<typeof createTilesMatrixComponent>;
export const createTilesMatrixComponent = (props: Size) =>
    createComponent(
        TilesMatrixID,
        createMatrixComponent({ ...props, seed: GET_EMPTY_TILE }),
    );

export function updateTile(target: Tile, source: Partial<Tile>) {
    Object.assign(target, source);
}

export function setMatrixTile(
    struct: TilesMatrix,
    x: number,
    y: number,
    tile: Tile,
) {
    Matrix.set(struct.matrix, x, y, tile);
}

export function initTiles(struct: TilesMatrix, x: number, y: number): void {
    if (Matrix.get(struct.matrix, x, y).type === TileType.empty) {
        setMatrixTile(struct, x, y, {
            env: TileEnv.Forest,
            type: TileType.passable,
            subtype: TileSubtype.gross,
        });
    }

    fillEmptyTiles(struct);
}

export function mergeTiles(
    struct: TilesMatrix,
    source: TMatrix,
    sx: number,
    sy: number,
): void {
    const target = struct.matrix;
    Matrix.forEach(source, (item, x, y) => {
        Matrix.set(target, sx + x, sy + y, item);
    });
}

export function moveTiles({ matrix }: TilesMatrix, v: Vector): void {
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
