import { shuffle } from 'lodash';
import { pipe } from 'lodash/fp';

import { HALF_CARD_SIZE, HALF_RENDER_CARD_SIZE, RENDER_CARD_SIZE } from '../../../../CONST';
import { floor } from '../../../../utils/math';
import { Matrix, TMatrix } from '../../../../utils/Matrix';
import { newVector, TVector, Vector } from '../../../../utils/shape';
import { Rect } from '../../../../utils/shapes/rect';
import { Village } from '../../../Villages';
import { getEmptyTile, Tile, TileEnv, TileType } from '../def';
import { fillEnvironment } from './environment';
import { fillCrossroads, fillRoads } from './roads';
import { isEmptyItem, isNotBuildingItem, isRoadItem } from './utils/is';
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

export function spawnVillage(
    village: Village,
    playerPosition: TVector,
    cardMatrix: TMatrix<Tile>,
    cardPosition: TVector,
): void {
    const direction = Vector.sum(village.position, Vector.negate(playerPosition), cardPosition);
    const step = Vector.normalize(direction);
    const delta = Vector.ZERO;
    const renderRect = Rect.create(
        HALF_CARD_SIZE - HALF_RENDER_CARD_SIZE,
        HALF_CARD_SIZE - HALF_RENDER_CARD_SIZE,
        RENDER_CARD_SIZE,
        RENDER_CARD_SIZE,
    );

    while (true) {
        if (Rect.pointInside(renderRect, delta)) {
            break;
        }

        Vector.set(delta, Vector.sum(delta, step));
    }

    const villageMatrix = createVillage(village.size.w, village.size.h);

    console.log('>>', village.position);
    console.log('>>', floor(playerPosition.x + delta.x), floor(playerPosition.y + delta.y));
    mergeMatrix(
        cardMatrix,
        villageMatrix,
        floor(playerPosition.x + delta.x),
        floor(playerPosition.y + delta.y),
    );
}
// export function trySpawnVillage(cardMatrix: TMatrix<Tile>, move: TVector): void {
//     if (!isOneWayDirection(move)) return;
//
//     const side = getRenderMatrixSide(cardMatrix, move, 1);
//     const roads = Matrix.reduce(
//         side,
//         [] as { tile: Tile; x: number; y: number }[],
//         (acc, tile, x, y) => {
//             if (isLastRoadItem(tile)) acc.push({ tile, x, y });
//             return acc;
//         },
//     );
//
//     if (roads.length === 0) return;
//
//     const villageMatrix = createVillage(21, 21);
//     const villageSide = Matrix.getSide(villageMatrix, negateVector(move), 1);
//     const villageRoads = Matrix.reduce(
//         villageSide,
//         [] as { tile: Tile; x: number; y: number }[],
//         (acc, tile, x, y) => {
//             if (isLastRoadItem(tile)) acc.push({ tile, x, y });
//             return acc;
//         },
//     );
//
//     if (villageRoads.length === 0) return;
//
//     const cardRoad = roads[floor(randomArbitrary(0, roads.length - 1))];
//     const villageRoad = villageRoads[floor(randomArbitrary(0, villageRoads.length - 1))];
//
//     const relX = stepNormalize(
//         move.x,
//         -villageMatrix.w,
//         cardRoad.x - villageRoad.x,
//         RENDER_CARD_SIZE,
//     );
//     const relY = stepNormalize(
//         move.y,
//         -villageMatrix.h,
//         cardRoad.y - villageRoad.y,
//         RENDER_CARD_SIZE,
//     );
//     const absX = CENTER_CARD_POSITION.x - floor(RENDER_CARD_SIZE / 2) + relX;
//     const absY = CENTER_CARD_POSITION.y - floor(RENDER_CARD_SIZE / 2) + relY;
//
//     mergeMatrix(cardMatrix, villageMatrix, absX, absY);
// }
//
// function stepNormalize(v: number, min: number, zero: number, max: number = zero): number {
//     return v === -1 ? min : v === 0 ? zero : max;
// }