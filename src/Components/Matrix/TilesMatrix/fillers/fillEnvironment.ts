import { pipe } from 'lodash/fp';

import { RENDER_CARD_SIZE } from '../../../../CONST';
import { floor } from '../../../../utils/math';
import { Matrix } from '../../../../utils/Matrix';
import { Item } from '../../../../utils/Matrix/methods/utils';
import { isPassableTileType, Tile, TileType } from '../def';
import { TilesMatrix } from '../index';
import {
    getProbabilityRecord,
    getRandomProbability,
    normalizeProbabilities,
    ProbabilityRecord,
} from './utils';

const isEmptyItem = (item: Item<Tile>) => item.value?.type === TileType.empty;
const isNotEmptyItem = (item: Item<Tile>) =>
    item.value === undefined ? false : item.value.type !== TileType.empty;

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

export function fillEnvironment({ matrix }: TilesMatrix): void {
    const sliceMatrix = Matrix.slice(
        matrix,
        floor(matrix.w / 2) - floor(RENDER_CARD_SIZE / 2),
        floor(matrix.h / 2) - floor(RENDER_CARD_SIZE / 2),
        RENDER_CARD_SIZE,
        RENDER_CARD_SIZE,
    );

    while (true) {
        const step1 = Matrix.matchReplaceAll(
            sliceMatrix,
            matchReplaceEnvironment,
        );

        if (!step1) {
            break;
        }
    }
}

function updateTile(itemTile: Item<Tile>): Tile {
    const slice = Matrix.slice<undefined | Tile>(
        itemTile.matrix,
        itemTile.x - 1,
        itemTile.y - 1,
        3,
        3,
    );

    const type = pipe(
        getProbabilityRecord(getTileProbabilities),
        normalizeProbabilities,
        getRandomProbability,
    )(slice) as TileType;

    return Object.assign(itemTile.value, {
        type,
        passable: isPassableTileType(type),
    });
}

function getTileProbabilities(
    tile: undefined | Tile,
): undefined | ProbabilityRecord {
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
            [TileType.gross]: 0.97,
            [TileType.wood]: 0.03,
        };
    }

    if (tile.type === TileType.wood) {
        return {
            [TileType.gross]: 0.15,
            [TileType.wood]: 0.85,
        };
    }

    return undefined;
}
