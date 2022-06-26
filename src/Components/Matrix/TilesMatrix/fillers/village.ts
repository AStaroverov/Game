import { shuffle } from 'lodash';
import { pipe } from 'lodash/fp';

import { floor } from '../../../../utils/math';
import { Matrix, TMatrix } from '../../../../utils/Matrix';
import { ItemMatchReplace } from '../../../../utils/Matrix/methods/matchReplace';
import { flipX } from '../../../../utils/Matrix/methods/transform';
import { range } from '../../../../utils/range';
import { newVector } from '../../../../utils/shape';
import { getEmptyTile, Tile, TileEnv, TileType } from '../def';
import { fillEnvironment } from './environment';
import { fillCrossroads, fillRoads } from './roads';
import { isEmptyTile } from './utils/is';
import { matchNotBuilding, matchRoad } from './utils/patterns';

const replaceToBuilding = (value: Tile): Tile => {
    return Object.assign(value, {
        type: TileType.building,
    });
};

const matchEmptyToBuilding = {
    match: isEmptyTile,
    replace: replaceToBuilding,
};

const createBuildingPattern = (
    s1: number,
    s2: number,
    getAllVariants = Matrix.getAllVariants,
): TMatrix<ItemMatchReplace<Tile>>[] => {
    const topBottomRow = range(s1 + 2).map(() => matchNotBuilding);
    const centerRow = [matchRoad, ...range(s1).map(() => matchEmptyToBuilding), matchNotBuilding];

    return getAllVariants(
        Matrix.fromNestedArray([
            /* eslint-disable */
            topBottomRow,
            ...range(s2).map(() => centerRow),
            topBottomRow
            /* eslint-enable */
        ]),
    );
};

const buildingPatterns = [
    ...createBuildingPattern(4, 3, (m) => [m, flipX(m)]),
    ...createBuildingPattern(5, 3, (m) => [m, flipX(m)]),
    ...createBuildingPattern(4, 4),
    ...createBuildingPattern(5, 4, (m) => [m, flipX(m)]),
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
