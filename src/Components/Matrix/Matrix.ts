import { Component, createComponent } from '../../../lib/ECS/Component';
import { Matrix, TMatrix, TMatrixSeed } from '../../utils/Matrix';
import { newSize, Size } from '../../utils/shape';

export const MatrixComponentID = 'MATRIX' as const;
export type MatrixStruct<T = unknown> = {
    matrix: TMatrix<T>;
};

export const createMatrixComponent = <T>(
    props: Size & { seed?: TMatrixSeed<T> },
): Component<typeof MatrixComponentID, MatrixStruct<T>> =>
    createComponent(MatrixComponentID, {
        matrix: Matrix.create<T>(props.w, props.h, props.seed),
    });

export type ExtractMatrixType<M> = M extends MatrixStruct<infer T> ? T : never;

export function getMatrixSize({ matrix }: MatrixStruct): Size {
    return newSize(matrix.w, matrix.h);
}

export function getMatrixCell<C extends MatrixStruct, T = ExtractMatrixType<C>>(
    { matrix }: C,
    x: number,
    y: number,
): undefined | T {
    return Matrix.get(matrix, x, y) as undefined | T;
}

export function getMatrixSlice<
    C extends MatrixStruct,
    T = ExtractMatrixType<C>,
>(comp: C, x: number, y: number, r: number): TMatrix<undefined | T> {
    const slice = Matrix.create<undefined | T>(r * 2 + 1, r * 2 + 1);

    for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
            Matrix.set(slice, r + i, r + j, getMatrixCell(comp, x + i, y + j));
        }
    }

    return slice;
}
