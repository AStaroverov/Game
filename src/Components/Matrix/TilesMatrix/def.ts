export type Tile = RoadTile | BaseTile;

export type RoadTile = BaseTile<{ last: boolean }>;
export type BaseTile<Meta extends object = {}> = Meta & {
    env: TileEnv;
    type: TileType;
    passable: boolean;
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

export const EMPTY_TILE = Object.freeze({
    env: TileEnv.Empty,
    type: TileEnv.Empty,
    passable: false,
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
