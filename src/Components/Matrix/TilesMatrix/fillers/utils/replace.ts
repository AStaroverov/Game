import { random } from '../../../../../utils/random';
import { RoadTile, Tile, TileType } from '../../def';

export const replaceToNotLastRoad = (tile: Tile) => {
    return Object.assign(tile, {
        type: TileType.road,
        last: false,
    }) as RoadTile;
};

export const replaceToLastRoad = (tile: Tile) => {
    return Object.assign(tile, {
        type: TileType.road,
        last: true,
    }) as RoadTile;
};

export const replaceToSomeRoad = (tile: Tile) => {
    return Object.assign(tile, {
        type: TileType.road,
        last: random() > 0.9,
    }) as RoadTile;
};
