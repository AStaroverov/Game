import { shuffle } from 'lodash';
import { pipe } from 'lodash/fp';

import { CENTER_CARD_POSITION, PLAYER_START_POSITION, RENDER_CARD_SIZE } from '../../../../CONST';
import { floor } from '../../../../utils/math';
import { Matrix, TMatrix } from '../../../../utils/Matrix';
import { randomArbitraryInt } from '../../../../utils/random';
import { negateVector, newVector, TVector, Vector } from '../../../../utils/shape';
import { Rect } from '../../../../utils/shapes/rect';
import { getEmptyTile, Tile, TileEnv, TileType } from '../def';
import { fillEnvironment } from './environment';
import { fillCrossroads, fillRoads } from './roads';
import { getRenderMatrixSide } from './utils/getRenderMatrixSide';
import { isEmptyItem, isLastRoadItem, isNotBuildingItem, isRoadItem } from './utils/is';
import { mergeMatrix } from './utils/mergeMatrix';

const replaceToBuilding = (value: Tile): Tile => {
    return Object.assign(value, {
        type: TileType.building,
    });
};

const matchRoad = {
    match: isRoadItem,
};

const matchNotBuilding = {
    match: isNotBuildingItem,
};

const matchEmptyToBuilding = {
    match: isEmptyItem,
    replace: replaceToBuilding,
};

const building2x2Pattern = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotBuilding, matchNotBuilding, matchNotBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchNotBuilding, matchNotBuilding, matchNotBuilding],
        /* eslint-enable */
    ]),
);

const building2x3Pattern = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotBuilding, matchNotBuilding, matchNotBuilding, matchNotBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchNotBuilding, matchNotBuilding, matchNotBuilding, matchNotBuilding],
        /* eslint-enable */
    ]),
);

const building3x2Pattern = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotBuilding, matchNotBuilding, matchNotBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchNotBuilding, matchNotBuilding, matchNotBuilding],
        /* eslint-enable */
    ]),
);

const building3x3Pattern = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotBuilding, matchNotBuilding, matchNotBuilding, matchNotBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchRoad, matchEmptyToBuilding, matchEmptyToBuilding, matchEmptyToBuilding],
        [matchNotBuilding, matchNotBuilding, matchNotBuilding, matchNotBuilding],
        /* eslint-enable */
    ]),
);

const buildingPatterns = [
    ...building2x2Pattern,
    ...building2x3Pattern,
    ...building3x2Pattern,
    ...building3x3Pattern,
];

export function fillBuildings(matrix: TMatrix<Tile>): void {
    while (true) {
        const step1 = Matrix.matchReplaceShuffle(matrix, shuffle(buildingPatterns));

        if (!step1) {
            break;
        }
    }
}

export function fillVillage<T extends TMatrix<Tile>>(matrix: T): T {
    fillRoads(matrix, 0);
    fillBuildings(matrix);
    fillEnvironment(matrix);

    Matrix.forEach(matrix, (item) => (item.env = TileEnv.Village));

    return matrix;
}

export function createVillage(w: number, h: number): TMatrix<Tile> {
    return pipe(
        (matrix) => fillCrossroads(matrix, newVector(floor(w / 2), floor(h / 2))),
        fillVillage,
    )(Matrix.create(w, h, getEmptyTile));
}

export interface IVillageMerger {
    shouldMerge(playerPosition: TVector): boolean;
    merge(playerPosition: TVector): void;
}
export function createVillageMerger(
    cardMatrix: TMatrix<Tile>,
    villageMatrix: TMatrix<Tile>,
    playerPosition: TVector,
    playerDirection: TVector,
): IVillageMerger {
    const moves = Vector.toOneWayVectors(playerDirection);

    playerDirection = moves[randomArbitraryInt(0, moves.length - 1)];

    const side = getRenderMatrixSide(cardMatrix, playerDirection, 1);
    const roads = Matrix.reduce(
        side,
        [] as { tile: Tile; x: number; y: number }[],
        (acc, tile, x, y) => {
            if (isLastRoadItem(tile)) acc.push({ tile, x, y });
            return acc;
        },
    );

    if (roads.length === 0) {
        throw new Error('Card doesnt have suitable roads');
    }

    const villageSide = Matrix.getSide(villageMatrix, negateVector(playerDirection), 1);
    const villageRoads = Matrix.reduce(
        villageSide,
        [] as { tile: Tile; x: number; y: number }[],
        (acc, tile, x, y) => {
            if (isLastRoadItem(tile)) acc.push({ tile, x, y });
            return acc;
        },
    );

    if (villageRoads.length === 0) {
        throw new Error('Village doesnt have suitable roads');
    }

    const cardRoad = roads[randomArbitraryInt(0, roads.length - 1)];
    const villageRoad = villageRoads[randomArbitraryInt(0, villageRoads.length - 1)];

    const relX = stepNormalize(
        playerDirection.x,
        -villageMatrix.w,
        cardRoad.x - villageRoad.x,
        RENDER_CARD_SIZE,
    );
    const relY = stepNormalize(
        playerDirection.y,
        -villageMatrix.h,
        cardRoad.y - villageRoad.y,
        RENDER_CARD_SIZE,
    );
    const matrixX = CENTER_CARD_POSITION.x - floor(RENDER_CARD_SIZE / 2) + relX;
    const matrixY = CENTER_CARD_POSITION.y - floor(RENDER_CARD_SIZE / 2) + relY;

    const merge = (newPlayerPosition: TVector) => {
        const delta = Vector.map(
            Vector.sum(newPlayerPosition, Vector.negate(playerPosition)),
            floor,
        );

        debugger;
        mergeMatrix(cardMatrix, villageMatrix, delta.x + matrixX, delta.y + matrixY);
    };

    debugger;
    const triggerRect = Rect.zoomByCenter(
        Rect.create(
            floor(playerPosition.x - PLAYER_START_POSITION.x) + relX,
            floor(playerPosition.y - PLAYER_START_POSITION.y) + relY,
            villageMatrix.w,
            villageMatrix.h,
        ),
        floor(RENDER_CARD_SIZE / 2),
    );
    const shouldMerge = (playerPosition: TVector): boolean => {
        debugger;
        return Rect.pointInside(triggerRect, playerPosition);
    };

    return {
        shouldMerge,
        merge,
    };
}

function stepNormalize(v: number, min: number, zero: number, max: number = zero): number {
    return v === -1 ? min : v === 0 ? zero : max;
}
