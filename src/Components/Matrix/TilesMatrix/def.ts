export type Tile<E = TileEnv> = {
    env: E;
    type: TileType;
    subtype: TileSubtype;
};

export enum TileEnv {
    Forest = 'Forest',
    Village = 'Village',
}

export enum TileType {
    empty = 'empty',
    passable = 'passable',
    impassable = 'impassable',
}

export enum TileSubtype {
    empty = 'empty',
    gross = 'gross',
    road = 'road',
    wood = 'wood',
    well = 'well',
    building = 'building',
}
