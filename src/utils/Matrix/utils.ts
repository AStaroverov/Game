import { Point } from '../shape';
import { Matrix } from './index';

export type Item<T> = Point & {
    value: T;
    matrix: Matrix<T>;
};

export function* radialForEach<T>(
    matrix: Matrix<T>,
    sx: number,
    sy: number,
    radius?: number,
): Iterator<undefined | Item<T>> {
    radius = radius ?? Math.max(matrix.n, matrix.m);

    yield getItem(0, 0);

    let dx = 0;
    let dy = 0;

    let step = 0;
    let shift = 0;
    while (step < radius) {
        step += 1;
        const size = step * 2;

        // top
        shift = 0;
        while (shift < size) {
            dx = -step + shift++;
            dy = -step;
            yield getItem(dx, dy);
        }

        // right
        shift = 0;
        while (shift < size) {
            dx = +step;
            dy = -step + shift++;
            yield getItem(dx, dy);
        }

        // bottom
        shift = 0;
        while (shift < size) {
            dx = step - shift++;
            dy = step;
            yield getItem(dx, dy);
        }

        // left
        shift = 0;
        while (shift < size) {
            dx = -step;
            dy = +step - shift++;
            yield getItem(dx, dy);
        }
    }

    function getItem(dx: number, dy: number) {
        const value = matrix.get(sx + dx, sy + dy);
        return value ? { value, x: sx + dx, y: sy + dy, matrix } : undefined;
    }
}
