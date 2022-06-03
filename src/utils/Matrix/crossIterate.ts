import { mulVector, newVector, Point, Vector, zeroVector } from '../shape';
import { TMatrix } from './index';
import { lineIterate } from './lineIterate';
import { createGetItem } from './utils';

export type Item<T> = Point & {
    value: T;
    matrix: TMatrix<T>;
};

export function* crossIterate<T>(
    matrix: TMatrix<T>,
    sv: Vector,
    radius: number,
): IterableIterator<undefined | Item<T>> {
    const getItem = createGetItem(matrix, sv);
    const directions = [
        newVector(1, 0),
        newVector(-1, 0),
        newVector(0, 1),
        newVector(0, -1),
    ].map((v) => mulVector(v, radius));

    yield getItem(zeroVector);

    for (let i = 0; i < directions.length; i++) {
        const iterator = lineIterate(matrix, sv, directions[i]);
        // skip first element
        let step = iterator.next();

        do {
            step = iterator.next();
            yield step.value;
        } while (step.done !== true);
    }
}
