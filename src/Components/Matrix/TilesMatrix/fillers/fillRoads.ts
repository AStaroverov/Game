import { shuffle } from 'lodash';

import { CARD_SIZE, RENDER_CARD_SIZE } from '../../../../CONST';
import { abs, min } from '../../../../utils/math';
import { Matrix } from '../../../../utils/Matrix';
import { ExistedItem, Item } from '../../../../utils/Matrix/methods/utils';
import { random } from '../../../../utils/random';
import { isEqualVectors, Vector, zeroVector } from '../../../../utils/shape';
import { Tile, TileType } from '../def';
import { TilesMatrix } from '../index';

const isExisted = (item: Item<Tile>): item is ExistedItem<Tile> =>
    item.value !== undefined;

const isEmptyItem = (item: Item<Tile>) =>
    isExisted(item) && item.value.type === TileType.empty;

const isRoadItem = (item: Item<Tile>) =>
    isExisted(item) && item.value.type === TileType.road;

const isNotRoadItem = (item: Item<Tile>) =>
    isExisted(item) && item.value.type !== TileType.road;

const isLastRoadItem = (item: Item<Tile>) =>
    isExisted(item) &&
    item.value.type === TileType.road &&
    'last' in item.value &&
    item.value.last === true;

const isNotLastRoadItem = (item: Item<Tile>) =>
    isExisted(item) &&
    item.value.type === TileType.road &&
    'last' in item.value &&
    item.value.last === false;

const replaceToNotLastRoad = ({ value }: Item<Tile>) => {
    return Object.assign(value, {
        last: false,
    });
};

const replaceToLastRoad = ({ value }: Item<Tile>) => {
    return Object.assign(value, {
        last: true,
    });
};

const matchEmpty = {
    match: isEmptyItem,
};
const matchRoad = {
    match: isRoadItem,
};
const matchNotRoad = {
    match: isNotRoadItem,
};
const matchLastRoadReplaceToNotLastRoad = {
    match: isLastRoadItem,
    replace: replaceToNotLastRoad,
};
const matchNotLastRoadReplaceToLastRoad = {
    match: isNotLastRoadItem,
    replace: replaceToLastRoad,
};
const matchEmptyReplaceToRoad = {
    match: isEmptyItem,
    replace: ({ value }: Item<Tile>) => {
        return Object.assign(value, {
            passable: true,
            type: TileType.road,
            last: false,
        });
    },
};
const matchEmptyReplaceToLastRoad = {
    match: isEmptyItem,
    replace: ({ value }: Item<Tile>) => {
        return Object.assign(value, {
            passable: true,
            type: TileType.road,
            last: true,
        });
    },
};

const fixLastRoad1 = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotRoad, matchEmpty],
        [matchNotLastRoadReplaceToLastRoad, matchEmpty],
        /* eslint-enable */
    ]),
);
const fixLastRoad2 = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchLastRoadReplaceToNotLastRoad, matchRoad],
        [matchRoad,                         matchNotRoad],
        /* eslint-enable */
    ]),
);

const roadGrow = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchRoad, matchLastRoadReplaceToNotLastRoad, matchEmptyReplaceToLastRoad],
        /* eslint-enable */
    ]),
);

const roadRotate = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotRoad, matchNotRoad, matchEmptyReplaceToLastRoad],
        [matchRoad, matchLastRoadReplaceToNotLastRoad, matchEmptyReplaceToRoad],
        /* eslint-enable */
    ]),
);

export function fillRoads({ matrix }: TilesMatrix, move: Vector): void {
    const shift = min(RENDER_CARD_SIZE, 3);
    const sliceMatrix = isEqualVectors(move, zeroVector)
        ? matrix
        : Matrix.slice(
              matrix,
              move.x === -1 ? 0 : move.x === 1 ? CARD_SIZE - shift : 0,
              move.y === -1 ? 0 : move.y === 1 ? CARD_SIZE - shift : 0,
              abs(move.x * shift) || CARD_SIZE,
              abs(move.y * shift) || CARD_SIZE,
          );

    Matrix.matchReplaceAll(sliceMatrix, fixLastRoad1);
    Matrix.matchReplaceAll(sliceMatrix, fixLastRoad2);

    while (true) {
        const step1 =
            random() > 0.8
                ? Matrix.matchReplace(sliceMatrix, shuffle(roadRotate))
                : false;
        const step2 = Matrix.matchReplace(sliceMatrix, shuffle(roadGrow));

        if (!(step1 || step2)) {
            break;
        }
    }
}
