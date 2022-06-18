export type Tile = RoadTile | BaseTile;

export type RoadTile = BaseTile<{ last: boolean }>;
export type BaseTile<Meta extends object = {}> = Meta & {
    env: TileEnv;
    type: TileType;
};

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

export const getEmptyTile = () => ({
    env: TileEnv.Empty,
    type: TileType.empty,
    passable: false,
});
export const getLastRoadTile = () => ({
    env: TileEnv.Empty,
    type: TileType.road,
    passable: true,
    last: true,
});
export const getRoadTile = () => ({
    ...getLastRoadTile(),
    last: false,
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
