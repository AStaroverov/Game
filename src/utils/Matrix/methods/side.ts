import { abs } from '../../math';
import { TVector } from '../../shape';
import { Matrix, TMatrix } from '../index';

export function getSide<T>(matrix: TMatrix<T>, dir: TVector, width: number): TMatrix<T> {
    return Matrix.slice(
        matrix,
        dir.x === 1 ? matrix.w - width : 0,
        dir.y === 1 ? matrix.h - width : 0,
        abs(dir.x * width) || matrix.w,
        abs(dir.y * width) || matrix.h,
    );
}
