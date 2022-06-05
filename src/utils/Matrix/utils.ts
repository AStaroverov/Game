import { Point, Vector } from '../shape';
import { Matrix, TMatrix } from './index';

export type Item<T> = Point & {
    value: undefined | T;
    matrix: TMatrix<T>;
};

export function createGetItem<T>(
    matrix: TMatrix<T>,
    sv: Vector,
): (dv: Vector) => Item<T> {
    return function getItem(dv: Vector): Item<T> {
        const value = Matrix.get(matrix, sv.x + dv.x, sv.y + dv.y);
        return { value, x: sv.x + dv.x, y: sv.y + dv.y, matrix };
    };
}
