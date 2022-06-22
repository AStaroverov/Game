import { Tile, TileType } from '../../def';

export const creteTypeDetector =
    (type: TileType, value: boolean) =>
    (item: Tile): item is Tile =>
        isExisted(item) && (item.type === type) === value;

export const isExisted = (item: undefined | Tile): item is Tile => item !== undefined;

export const isEmptyTile = creteTypeDetector(TileType.empty, true);
export const isNotEmptyTile = creteTypeDetector(TileType.empty, false);

export const isRoadTile = creteTypeDetector(TileType.road, true);
export const isNotRoadTile = creteTypeDetector(TileType.road, false);
export const isLastRoadTile = (item: Tile) => isRoadTile(item) && 'last' in item && item.last;
export const isNotLastRoadTile = (item: Tile) => isRoadTile(item) && 'last' in item && !item.last;

export const isBuildingTile = creteTypeDetector(TileType.building, true);
export const isNotBuildingTile = creteTypeDetector(TileType.building, false);
