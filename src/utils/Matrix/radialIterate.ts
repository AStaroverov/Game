import { Point } from '../shape';
import { Matrix, TMatrix } from './index';

export type Item<T> = Point & {
    value: T;
    matrix: TMatrix<T>;
};

export function* radialIterate<T>(
    matrix: TMatrix<T>,
    sx: number,
    sy: number,
    radius?: number,
): Iterator<undefined | Item<T>> {
    radius = radius ?? Math.max(matrix.w, matrix.h);

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
        const value = Matrix.get(matrix, sx + dx, sy + dy);
        return value ? { value, x: sx + dx, y: sy + dy, matrix } : undefined;
    }
}
