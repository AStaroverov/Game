import { RENDER_CARD_SIZE } from '../../../../../CONST';
import { floor } from '../../../../../utils/math';
import { Matrix, TMatrix } from '../../../../../utils/Matrix';

export function getRenderMatrixSlice<T>(matrix: TMatrix<T>): TMatrix<T> {
    return Matrix.slice(
        matrix,
        floor(matrix.w / 2) - floor(RENDER_CARD_SIZE / 2),
        floor(matrix.h / 2) - floor(RENDER_CARD_SIZE / 2),
        RENDER_CARD_SIZE,
        RENDER_CARD_SIZE,
    );
}
