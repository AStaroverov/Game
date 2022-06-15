import { RENDER_CARD_SIZE } from '../../../../../CONST';
import { abs, floor, min } from '../../../../../utils/math';
import { Matrix, TMatrix } from '../../../../../utils/Matrix';
import { newVector, TVector } from '../../../../../utils/shape';

export function getRenderMatrixSide<T>(
    matrix: TMatrix<T>,
    dir: TVector,
    width: number,
): TMatrix<T> {
    const shift = min(RENDER_CARD_SIZE, width);
    const renderVecFirst = newVector(
        floor(matrix.w / 2) - floor(RENDER_CARD_SIZE / 2),
        floor(matrix.h / 2) - floor(RENDER_CARD_SIZE / 2),
    );
    const renderVecLast = newVector(
        renderVecFirst.x + RENDER_CARD_SIZE - shift,
        renderVecFirst.y + RENDER_CARD_SIZE - shift,
    );
    return Matrix.slice(
        matrix,
        dir.x === 1 ? renderVecLast.x : renderVecFirst.x,
        dir.y === 1 ? renderVecLast.y : renderVecFirst.y,
        abs(dir.x * shift) || RENDER_CARD_SIZE,
        abs(dir.y * shift) || RENDER_CARD_SIZE,
    );
}
