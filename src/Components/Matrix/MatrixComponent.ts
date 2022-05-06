import { hasComponent } from '../../../lib/ECS/entities';
import { Entity } from '../../../lib/ECS/types';
import { Matrix, MatrixSeed } from '../../utils/Matrix';
import { newSize, Size } from '../../utils/shape';

type MatrixComponentType<M> = M extends MatrixComponent<infer T> ? T : never;

export class MatrixComponent<T = unknown> {
    seed: MatrixSeed<T>;
    matrix: Matrix<T>;

    constructor(props: Size & { seed: MatrixSeed<T> }) {
        this.seed = props.seed;
        this.matrix = new Matrix<T>(props.w, props.h, props.seed);
    }
}

export function hasMatrixComponent<T extends MatrixComponent>(
    entity: Entity,
): entity is Entity<T> {
    return hasComponent(entity, MatrixComponent);
}

export function getMatrixSize({ matrix }: MatrixComponent): Size {
    return newSize(matrix.w, matrix.h);
}

export function getMatrixCell<
    C extends MatrixComponent,
    T = MatrixComponentType<C>,
>({ matrix }: C, x: number, y: number): undefined | T {
    return matrix.get(x, y) as undefined | T;
}

export function getMatrixSlice<
    C extends MatrixComponent,
    T = MatrixComponentType<C>,
>(comp: C, x: number, y: number, r: number): Matrix<undefined | T> {
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
