import { Assign } from '../../../types';
import { TVector } from '../../../utils/shape';

export type Tile = UnknownTile | RoadTile;

export type UnknownTile = TVector & {
    env: TileEnv;
    type: Exclude<TileType, TileType.road>;
};
export type RoadTile = Assign<UnknownTile, { type: TileType.road; last: boolean }>;

export enum TileEnv {
    Empty = 'Empty',
    Forest = 'Forest',
    Village = 'Village',
}

export enum TileType {
    empty = 'empty',
    gross = 'gross',
    road = 'road',
    wood = 'wood',
    well = 'well',
    building = 'building',
}

export const getEmptyTile = (x: number, y: number): Tile => ({
    x,
    y,
    env: TileEnv.Empty,
    type: TileType.empty,
});
export const getRoadTile = (x: number, y: number): RoadTile => ({
    x,
    y,
    env: TileEnv.Empty,
    type: TileType.road,
    last: false,
});
export const getLastRoadTile = (x: number, y: number): RoadTile => ({
    ...getRoadTile(x, y),
    env: TileEnv.Empty,
    type: TileType.road,
    last: true,
});

export function isPassableTileType(type: TileType) {
    switch (type) {
        case TileType.wood:
        case TileType.building:
            return false;
        default:
            return true;
    }
}
