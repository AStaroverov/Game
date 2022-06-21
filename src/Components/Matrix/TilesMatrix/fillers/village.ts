import { shuffle } from 'lodash';
import { pipe } from 'lodash/fp';

import { floor } from '../../../../utils/math';
import { Matrix, TMatrix } from '../../../../utils/Matrix';
import { newVector } from '../../../../utils/shape';
import { getEmptyTile, Tile, TileEnv, TileType } from '../def';
import { fillEnvironment } from './environment';
import { fillCrossroads, fillRoads } from './roads';
import { isEmptyItem } from './utils/is';
import { matchNotBuilding, matchRoad } from './utils/patterns';

const replaceToBuilding = (value: Tile): Tile => {
    return Object.assign(value, {
        type: TileType.building,
    });
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
