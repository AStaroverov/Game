import { shuffle } from 'lodash';

import { Matrix, TMatrix } from '../../../../utils/Matrix';
import { random } from '../../../../utils/random';
import { isEqualVectors, toOneWayVectors, TVector, zeroVector } from '../../../../utils/shape';
import { getLastRoadTile, getRoadTile, Tile, TileType } from '../def';
import { getRenderMatrixSide } from './utils/getRenderMatrixSide';
import { getRenderMatrixSlice } from './utils/getRenderMatrixSlice';
import {
    isEmptyItem,
    isLastRoadItem,
    isNotLastRoadItem,
    isNotRoadItem,
    isRoadItem,
} from './utils/is';

const replaceToNotLastRoad = (tile: Tile) => {
    return Object.assign(tile, {
        type: TileType.road,
        last: false,
    });
};

const replaceToLastRoad = (tile: Tile) => {
    return Object.assign(tile, {
        type: TileType.road,
        last: true,
    });
};

const replaceToSomeRoad = (tile: Tile) => {
    return Object.assign(tile, {
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

export function fillRoads(matrix: TMatrix<Tile>, rotateChance = 0.1): void {
    while (true) {
        const step1 =
            random() < rotateChance && Matrix.matchReplace(matrix, getRoadRotatePattern());

        const step2 = Matrix.matchReplace(matrix, shuffle(roadGrowPatterns));

        if (!(step1 || step2)) {
            break;
        }
    }
}

export function updateRoads(matrix: TMatrix<Tile>, move: TVector): void {
    toOneWayVectors(move).forEach((move) => {
        const sliceMatrix = isEqualVectors(move, zeroVector)
            ? getRenderMatrixSlice(matrix)
            : getRenderMatrixSide(matrix, move, 3);
        const shouldSpawnNewRoad =
            random() > 0.9 &&
            Matrix.every(getRenderMatrixSlice(matrix), (tile) => tile.type !== TileType.road);

        Matrix.matchReplaceAll(sliceMatrix, fixLastRoad1);
        Matrix.matchReplaceAll(sliceMatrix, fixLastRoad2);

        if (shouldSpawnNewRoad) {
            Matrix.matchReplaceAll(sliceMatrix, randomSpawnRoad);
        }

        fillRoads(sliceMatrix);
    });
}

export function fillCrossroads(matrix: TMatrix<Tile>, vec: TVector): TMatrix<Tile> {
    Matrix.set(matrix, vec.x, vec.y, getRoadTile());
    Matrix.set(matrix, vec.x + 1, vec.y, getLastRoadTile());
    Matrix.set(matrix, vec.x - 1, vec.y, getLastRoadTile());
    Matrix.set(matrix, vec.x, vec.y + 1, getLastRoadTile());
    Matrix.set(matrix, vec.x, vec.y - 1, getLastRoadTile());

    return matrix;
}
