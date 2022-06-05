export type Tile<E = TileEnv> = BaseTile<E>;

export type BaseTile<E> = {
    env: E;
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

export function isPassableTileType(type: TileType) {
    switch (type) {
        case TileType.wood:
        case TileType.building:
            return false;
        default:
            return true;
    }
}