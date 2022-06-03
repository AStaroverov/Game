import { Vector } from '../../../utils/shape';

export type Tile<E = TileEnv> = BaseTile<E> | RoadTile<E>;

export type BaseTile<E> = {
    env: E;
    type: TileType;
    passable: boolean;
};

export type RoadTile<E> = BaseTile<E> & {
    directions: Vector[];
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

export function isRoadTile<T extends Tile>(
    tile: T,
): tile is Extract<T, RoadTile<T['env']>> {
    return tile.type === TileType.road;
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
