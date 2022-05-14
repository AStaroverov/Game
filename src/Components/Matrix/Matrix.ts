import { Component, createComponent } from '../../../lib/ECS/component';
import { Matrix, MatrixSeed } from '../../utils/Matrix';
import { newSize, Size } from '../../utils/shape';

export const MatrixComponentID = <const>'MATRIX';
export type MatrixComponent<T = unknown> = Component<
    typeof MatrixComponentID,
    {
        seed: MatrixSeed<T>;
        matrix: Matrix<T>;
    }
>;
export const createMatrixComponent = <T = unknown>(
    props: Size & { seed: MatrixSeed<T> },
) => {
    return createComponent(MatrixComponentID, {
        seed: props.seed,
        matrix: new Matrix<T>(props.w, props.h, props.seed),
    });
};

export function getMatrixSize({ matrix }: MatrixComponent): Size {
    return newSize(matrix.w, matrix.h);
}

export function getMatrixCell<C extends MatrixComponent, T = MatrixComponent>(
    { matrix }: C,
    x: number,
    y: number,
): undefined | T {
    return matrix.get(x, y) as undefined | T;
}

export function getMatrixSlice<C extends MatrixComponent, T = MatrixComponent>(
    comp: C,
    x: number,
    y: number,
    r: number,
): Matrix<undefined | T> {
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
