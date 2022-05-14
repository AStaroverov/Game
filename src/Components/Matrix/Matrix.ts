import { Component, createComponent } from '../../../lib/ECS/Component';
import { Like } from '../../../lib/ECS/types';
import { Matrix, MatrixSeed } from '../../utils/Matrix';
import { newSize, Size } from '../../utils/shape';

export const MatrixComponentID = 'MATRIX' as const;
export type MatrixComponent<T = unknown> = Component<
    typeof MatrixComponentID,
    {
        seed: MatrixSeed<T>;
        matrix: Matrix<T>;
    }
>;

export const createMatrixComponent = <T>(
    props: Size & { seed: MatrixSeed<T> },
): MatrixComponent<T> =>
    createComponent(MatrixComponentID, {
        seed: props.seed,
        matrix: new Matrix<T>(props.w, props.h, props.seed),
    });

export type ExtractMatrixType<M> = M extends Like<MatrixComponent<infer T>>
    ? T
    : never;

export function getMatrixSize({ matrix }: MatrixComponent['body']): Size {
    return newSize(matrix.w, matrix.h);
}

export function getMatrixCell<
    C extends Like<MatrixComponent>,
    T = ExtractMatrixType<C>,
>({ matrix }: C['body'], x: number, y: number): undefined | T {
    return matrix.get(x, y) as undefined | T;
}

export function getMatrixSlice<
    C extends Like<MatrixComponent>,
    T = ExtractMatrixType<C>,
>(comp: C['body'], x: number, y: number, r: number): Matrix<undefined | T> {
    const slice = new Matrix<undefined | T>(
        r * 2 + 1,
        r * 2 + 1,
        comp.seed as MatrixSeed<T>,
    );

    for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
            slice.set(r + i, r + j, getMatrixCell(comp, x + i, y + j));
        }
    }

    return slice;
}
