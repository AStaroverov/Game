import Enumerable from '../../../../../lib/linq';
import { floor, round } from '../../../../utils/math';
import { TMatrix } from '../../../../utils/Matrix';
import { crossIterate } from '../../../../utils/Matrix/crossIterate';
import { lineIterate } from '../../../../utils/Matrix/lineIterate';
import { Item, radialIterate } from '../../../../utils/Matrix/radialIterate';
import { random, randomArbitrary } from '../../../../utils/random';
import {
    isEqualVectors,
    mulVector,
    negateVector,
    sumVector,
    Vector,
} from '../../../../utils/shape';
import { Tile, TileEnv, TileType } from '../def';
import { getMatrixTile, setMatrixTile, TilesMatrix } from '../index';

type ItemTile = Pick<Item<undefined | Tile>, 'value' | 'x' | 'y'>;

export function fillRoads({ matrix }: TilesMatrix): void {
    const items = Enumerable.from(
        radialIterate(matrix, floor(matrix.h / 2), floor(matrix.w / 2)),
    )
        .skip(1)
        .where((item): item is Item<Tile> => item?.value.type === TileType.road)
        .toArray();

    items.forEach((item) => {
        const prevItems = Enumerable.from(crossIterate(matrix, item, 1))
            .skip(1)
            .where(isRoadItemTile)
            .toArray();

        if (prevItems.length === 0 || prevItems.length > 1) {
            return;
        }

        // we cant uncomment it,cause TS error
        let lastItem: ItemTile = item;
        let lastPrevItem: ItemTile = prevItems[0];

        while (true) {
            const possibleNextItems = Enumerable.from(
                crossIterate(matrix, lastItem, 1),
            )
                .skip(1)
                .where(isPossibleRoadItemTile)
                .toArray();

            if (possibleNextItems.length === 0) {
                break;
            }

            const randomNextPosition =
                possibleNextItems[
                    round(randomArbitrary(0, possibleNextItems.length - 1))
                ];
            const forwardDirection = getDirection(lastItem, lastPrevItem);
            const nextForwardPosition = sumVector(lastItem, forwardDirection);

            const canRotate = isCanRotate(matrix, lastItem, forwardDirection);
            const canGoForward = possibleNextItems.some((item) =>
                isEqualVectors(item, nextForwardPosition),
            );

            const nextPosition = !canRotate
                ? nextForwardPosition
                : canGoForward
                ? random() > 0.1
                    ? nextForwardPosition
                    : randomNextPosition
                : randomNextPosition;

            const nextTile = trySetNextTile(matrix, nextPosition);

            if (nextTile === undefined) {
                break;
            }

            lastPrevItem = lastItem;
            lastItem = createItemTile(nextTile, nextPosition);
        }
    });
}

function isRoadItemTile<T extends ItemTile>(item: T): item is T {
    return item.value?.type === TileType.road;
}

function isPossibleRoadItemTile<T extends ItemTile>(item: T): item is T {
    return item.value === undefined || item.value.type === TileType.empty;
}

function getDirection(item: ItemTile, prevItem: ItemTile): Vector {
    return sumVector(negateVector(prevItem), item);
}

function isCanRotate(
    matrix: TMatrix<Tile>,
    start: Vector,
    direction: Vector,
): boolean {
    return [
        ...lineIterate(matrix, start, mulVector(negateVector(direction), 3)),
    ].every(isRoadItemTile);
}

function trySetNextTile(
    matrix: TMatrix<Tile>,
    position: Vector,
): undefined | Tile {
    const tile = getMatrixTile(matrix, position);

    return tile?.type === TileType.empty
        ? setMatrixTile(matrix, position, {
              env: TileEnv.Forest,
              type: TileType.road,
              passable: true,
          })
        : undefined;
}

function createItemTile(tile: Tile, position: Vector): ItemTile {
    return { ...position, value: tile };
}
