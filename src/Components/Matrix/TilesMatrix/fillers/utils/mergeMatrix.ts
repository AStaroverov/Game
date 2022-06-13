import { Matrix, TMatrix } from '../../../../../utils/Matrix';

export function mergeMatrix<T, S>(
    target: TMatrix<T>,
    source: TMatrix<S>,
    sx: number,
    sy: number,
): TMatrix<T & S> {
    Matrix.forEach(source, (item, x, y) => {
        Matrix.set(target as TMatrix<T & S>, sx + x, sy + y, item);
    });

    return target as TMatrix<T & S>;
}
