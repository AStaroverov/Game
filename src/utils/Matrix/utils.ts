import { Point, Vector } from '../shape';
import { Matrix, TMatrix } from './index';

export type Item<T> = Point & {
    value: T;
    matrix: TMatrix<T>;
};

export function createGetItem<T>(
    matrix: TMatrix<T>,
    sv: Vector,
): (dv: Vector) => undefined | Item<T> {
    return function getItem(dv: Vector): undefined | Item<T> {
        const value = Matrix.get(matrix, sv.x + dv.x, sv.y + dv.y);

        return value === undefined
            ? undefined
            : { value, x: sv.x + dv.x, y: sv.y + dv.y, matrix };
    };
}
