import { mulVector, newVector, Vector, zeroVector } from '../shape';
import { TMatrix } from './index';
import { lineIterate } from './lineIterate';
import { createGetItem, Item } from './utils';

export function* crossIterate<T>(
    matrix: TMatrix<T>,
    start: Vector,
    radius: number,
): IterableIterator<Item<T>> {
    const getItem = createGetItem(matrix, start);
    const directions = [
        newVector(1, 0),
        newVector(-1, 0),
        newVector(0, 1),
        newVector(0, -1),
    ].map((v) => mulVector(v, radius));

    yield getItem(zeroVector);

    for (let i = 0; i < directions.length; i++) {
        const iterator = lineIterate(matrix, start, directions[i]);
        // skip first element
        let step = iterator.next();

        while ((step = iterator.next()).done !== true) {
            yield step.value;
        }
    }
}
