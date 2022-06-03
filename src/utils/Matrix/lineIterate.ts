import { abs, floor, max } from '../math';
import { mapVector, newVector, setVector, sumVector, Vector } from '../shape';
import { TMatrix } from './index';
import { createGetItem, Item } from './utils';

export function* lineIterate<T>(
    matrix: TMatrix<T>,
    sv: Vector,
    direction: Vector,
): Iterator<undefined | Item<T>> {
    const getItem = createGetItem(matrix, sv);
    const passed = newVector(0, 0);
    const step = newVector(
        direction.x / max(abs(direction.x), abs(direction.y)),
        direction.y / max(abs(direction.x), abs(direction.y)),
    );

    yield getItem(passed);

    while (passed.x !== direction.x || passed.y !== direction.y) {
        setVector(passed, sumVector(passed, step));
        yield getItem(mapVector(passed, floor));
    }
}
