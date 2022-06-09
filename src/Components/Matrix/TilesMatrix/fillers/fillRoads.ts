import { shuffle } from 'lodash';

import { RENDER_CARD_SIZE } from '../../../../CONST';
import { floor } from '../../../../utils/math';
import { Matrix } from '../../../../utils/Matrix';
import { Item } from '../../../../utils/Matrix/methods/utils';
import { random } from '../../../../utils/random';
import { Tile, TileType } from '../def';
import { TilesMatrix } from '../index';

const isRoadItem = (item: Item<Tile>) => item.value?.type === TileType.road;
const isLastRoadItem = (item: Item<Tile>) =>
    item.value !== undefined &&
    item.value.type === TileType.road &&
    'last' in item.value &&
    item.value.last === true;
const isNotLastRoadItem = (item: Item<Tile>) =>
    item.value !== undefined &&
    item.value.type === TileType.road &&
    'last' in item.value &&
    item.value.last === false;

const isNotRoadItem = (item: Item<Tile>) =>
    item.value === undefined || item.value.type !== TileType.road;
const isEmptyItem = (item: Item<Tile>) => item.value?.type === TileType.empty;

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

const matchReplacesFixLastRoad1 = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotRoad, matchEmpty],
        [matchNotLastRoadReplaceToLastRoad, matchEmpty],
        /* eslint-enable */
    ]),
);
const matchReplacesFixLastRoad2 = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchLastRoadReplaceToNotLastRoad, matchRoad],
        [matchRoad,                         matchNotRoad],
        /* eslint-enable */
    ]),
);
const matchReplacesRoadGrow = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchRoad, matchLastRoadReplaceToNotLastRoad, matchEmptyReplaceToLastRoad],
        /* eslint-enable */
    ]),
);

const matchReplacesRoadRotate = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotRoad, matchNotRoad, matchEmptyReplaceToLastRoad],
        [matchRoad, matchLastRoadReplaceToNotLastRoad, matchEmptyReplaceToRoad],
        /* eslint-enable */
    ]),
);

export function fillRoads({ matrix }: TilesMatrix, moved = false): void {
    const sliceMatrix = Matrix.slice(
        matrix,
        floor(matrix.w / 2) - floor(RENDER_CARD_SIZE / 2),
        floor(matrix.h / 2) - floor(RENDER_CARD_SIZE / 2),
        RENDER_CARD_SIZE,
        RENDER_CARD_SIZE,
    );

    if (moved) {
        Matrix.matchReplaceAll(sliceMatrix, matchReplacesFixLastRoad1);
        Matrix.matchReplaceAll(sliceMatrix, matchReplacesFixLastRoad2);
    }

    while (true) {
        const step1 =
            random() > 0.9
                ? Matrix.matchReplace(
                      sliceMatrix,
                      shuffle(matchReplacesRoadRotate),
                  )
                : false;
        const step2 = Matrix.matchReplace(
            sliceMatrix,
            shuffle(matchReplacesRoadGrow),
        );
        if (!(step1 || step2)) {
            break;
        }
    }
}
