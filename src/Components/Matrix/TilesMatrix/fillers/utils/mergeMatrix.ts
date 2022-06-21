import { Matrix, TMatrix } from '../../../../../utils/Matrix';

export function mergeMatrix<T, S = T, R = T | S>(
    target: TMatrix<T>,
    source: TMatrix<S>,
    sx: number,
    sy: number,
    merger: (tc: T, sc: S) => R = (tc, sc) => sc as unknown as R,
): TMatrix<R> {
    Matrix.forEach(source, (sc, x, y) => {
        const tc = Matrix.get(target, sx + x, sy + y);

        if (tc !== undefined) {
            // @ts-ignore
            Matrix.set(target, sx + x, sy + y, merger(tc, sc));
        }
    });

    return target as unknown as TMatrix<R>;
}
