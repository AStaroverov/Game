import { createComponent, ReturnStruct } from '../../../../lib/ECS/Component';
import { Matrix } from '../../../utils/Matrix';
import { TSize, TVector } from '../../../utils/shape';
import { createMatrixComponent } from '../Matrix';
import { getEmptyTile, Tile } from './def';

export const TilesMatrixID = 'TILES_MATRIX' as const;
export type TilesMatrix = ReturnStruct<typeof createTilesMatrixComponent>;
export type TilesMatrixComponent = ReturnType<typeof createTilesMatrixComponent>;
export const createTilesMatrixComponent = (props: TSize) =>
    createComponent(TilesMatrixID, createMatrixComponent({ ...props, seed: getEmptyTile }));

export function moveTiles({ matrix }: TilesMatrix, v: TVector): void {
    const { w, h } = matrix;
    const tmp = Matrix.create<Tile>(w, h, getEmptyTile);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const prevTile = Matrix.get(matrix, i + v.x, j + v.y);
            prevTile && Matrix.set(tmp, i, j, prevTile);
        }
    }

    Matrix.setSource(matrix, tmp.buffer);
}
