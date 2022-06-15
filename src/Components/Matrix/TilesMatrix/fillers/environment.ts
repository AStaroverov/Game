import { pipe } from 'lodash/fp';

import { Matrix, TMatrix } from '../../../../utils/Matrix';
import { isEqualVectors, toOneWayVectors, TVector, zeroVector } from '../../../../utils/shape';
import { isPassableTileType, Tile, TileType } from '../def';
import { getRenderMatrixSide } from './utils/getRenderMatrixSide';
import { getRenderMatrixSlice } from './utils/getRenderMatrixSlice';
import { isEmptyItem, isNotEmptyItem } from './utils/is';
import {
    getProbabilityRecord,
    getRandomProbability,
    normalizeProbabilities,
    ProbabilityRecord,
} from './utils/probabilities';

const matchNotEmpty = {
    match: isNotEmptyItem,
};
const matchEmptyReplaceToSome = {
    match: isEmptyItem,
    replace: updateTile,
};

const matchReplaceEnvironment = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchEmptyReplaceToSome, matchNotEmpty],
        /* eslint-enable */
    ]),
);

export function updateEnvironment(matrix: TMatrix<Tile>, move: TVector): void {
    toOneWayVectors(move).forEach((move) => {
        const sliceMatrix = isEqualVectors(move, zeroVector)
            ? getRenderMatrixSlice(matrix)
            : getRenderMatrixSide(matrix, move, 2);

        fillEnvironment(sliceMatrix);
    });
}

export function fillEnvironment(matrix: TMatrix<Tile>) {
    while (true) {
        const step1 = Matrix.matchReplaceAll(matrix, matchReplaceEnvironment);

        if (!step1) {
            break;
        }
    }
}

function updateTile(tile: Tile, x: number, y: number, matrix: TMatrix<Tile>): Tile {
    const slice = Matrix.slice<Tile>(matrix, x - 1, y - 1, 3, 3);
    const type = pipe(
        getProbabilityRecord(getTileProbabilities),
        normalizeProbabilities,
        getRandomProbability,
    )(slice) as TileType;

    return Object.assign(tile, {
        type,
        passable: isPassableTileType(type),
    });
}

function getTileProbabilities(tile: undefined | Tile): undefined | ProbabilityRecord {
    if (tile === undefined) {
        return undefined;
    }

    if (tile.type === TileType.road) {
        return {
            [TileType.gross]: 0.95,
            [TileType.wood]: 0.05,
        };
    }

    if (tile.type === TileType.gross) {
        return {
            [TileType.gross]: 0.9,
            [TileType.wood]: 0.1,
        };
    }

    if (tile.type === TileType.wood) {
        return {
            [TileType.gross]: 0.15,
            [TileType.wood]: 0.85,
        };
    }

    if (tile.type === TileType.building) {
        return {
            [TileType.gross]: 0.15,
            [TileType.wood]: 0.85,
        };
    }
    return undefined;
}
