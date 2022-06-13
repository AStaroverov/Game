import { createComponent, ReturnStruct } from '../../../../lib/ECS/Component';
import { Matrix } from '../../../utils/Matrix';
import { Size, Vector } from '../../../utils/shape';
import { createMatrixComponent } from '../Matrix';
import { Tile, TileEnv, TileType } from './def';

const GET_EMPTY_TILE = (): Tile => ({
    env: TileEnv.Empty,
    type: TileType.empty,
});

export const TilesMatrixID = 'TILES_MATRIX' as const;
export type TilesMatrix = ReturnStruct<typeof createTilesMatrixComponent>;
export const createTilesMatrixComponent = (props: Size) =>
    createComponent(
        TilesMatrixID,
        createMatrixComponent({ ...props, seed: GET_EMPTY_TILE }),
    );

export function moveTiles({ matrix }: TilesMatrix, v: Vector): void {
    const { w, h } = matrix;
    const tmp = Matrix.create<Tile>(w, h, GET_EMPTY_TILE);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const prevTile = Matrix.get(matrix, i + v.x, j + v.y);
            prevTile && Matrix.set(tmp, i, j, prevTile);
        }
    }

    Matrix.setSource(matrix, tmp.buffer);
}
