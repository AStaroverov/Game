import { shuffle } from 'lodash';

import { Matrix } from '../../../../utils/Matrix';
import { ExistedItem, Item } from '../../../../utils/Matrix/methods/utils';
import { random } from '../../../../utils/random';
import {
    isEqualVectors,
    toOneWayVectors,
    Vector,
    zeroVector,
} from '../../../../utils/shape';
import { Tile, TileType } from '../def';
import { TilesMatrix } from '../index';
import { getMatrixSide, getRenderMatrix } from './utils/getMatrixSide';

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
    isRoadItem(item) &&
    'last' in item.value &&
    item.value.last === true;

const isNotLastRoadItem = (item: Item<Tile>) =>
    isExisted(item) &&
    isRoadItem(item) &&
    'last' in item.value &&
    item.value.last === false;

const replaceToNotLastRoad = ({ value }: Item<Tile>) => {
    return Object.assign(value, {
        passable: true,
        type: TileType.road,
        last: false,
    });
};

const replaceToLastRoad = ({ value }: Item<Tile>) => {
    return Object.assign(value, {
        passable: true,
        type: TileType.road,
        last: true,
    });
};

const replaceToSomeRoad = ({ value }: Item<Tile>) => {
    return Object.assign(value, {
        passable: true,
        type: TileType.road,
        last: random() > 0.9,
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
const matchLastRoadReplaceSomeRoad = {
    match: isLastRoadItem,
    replace: replaceToSomeRoad,
};
const matchLastRoadReplaceToNotLastRoad = {
    match: isLastRoadItem,
    replace: replaceToNotLastRoad,
};
const matchNotLastRoadReplaceToLastRoad = {
    match: isNotLastRoadItem,
    replace: replaceToLastRoad,
};
const matchEmptyReplaceToSomeRoad = {
    match: isEmptyItem,
    replace: replaceToSomeRoad,
};
const matchEmptyReplaceToLastRoad = {
    match: isEmptyItem,
    replace: replaceToLastRoad,
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
        [matchLastRoadReplaceSomeRoad, matchRoad],
        [matchRoad,                         matchNotRoad],
        /* eslint-enable */
    ]),
);
const randomSpawnRoad = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchEmptyReplaceToSomeRoad, matchEmptyReplaceToLastRoad],
        /* eslint-enable */
    ]),
);

const roadGrowPatterns = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchRoad, matchLastRoadReplaceToNotLastRoad, matchEmptyReplaceToLastRoad],
        /* eslint-enable */
    ]),
);

const roadRotatePattern = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotRoad, matchNotRoad,                   matchEmptyReplaceToLastRoad],
        [matchRoad, matchLastRoadReplaceToNotLastRoad, matchEmptyReplaceToSomeRoad],
        /* eslint-enable */
    ]),
);
const filterRoadRotate = () => random() > 0.6;
const getRoadRotatePattern = () => roadRotatePattern.filter(filterRoadRotate);

export function fillRoads({ matrix }: TilesMatrix, move: Vector): void {
    toOneWayVectors(move).forEach((move) => {
        const sliceMatrix = isEqualVectors(move, zeroVector)
            ? getRenderMatrix(matrix)
            : getMatrixSide(matrix, move, 3);
        const shouldSpawnNewRoad =
            random() > 0.9 &&
            Matrix.every(
                getRenderMatrix(matrix),
                (tile) => tile.type !== TileType.road,
            );

        Matrix.matchReplaceAll(sliceMatrix, fixLastRoad1);
        Matrix.matchReplaceAll(sliceMatrix, fixLastRoad2);

        if (shouldSpawnNewRoad) {
            Matrix.matchReplaceAll(sliceMatrix, randomSpawnRoad);
        }

        while (true) {
            const step1 =
                random() > 0.9 &&
                Matrix.matchReplace(sliceMatrix, getRoadRotatePattern());

            const step2 = Matrix.matchReplace(
                sliceMatrix,
                shuffle(roadGrowPatterns),
            );

            if (!(step1 || step2)) {
                break;
            }
        }
    });
}
