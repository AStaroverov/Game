import { Tile, TileType } from '../../def';

export const creteTypeDetector =
    (type: TileType, value: boolean) =>
    (item: Tile): item is Tile =>
        isExisted(item) && (item.type === type) === value;

export const isExisted = (item: undefined | Tile): item is Tile =>
    item !== undefined;

export const isEmptyItem = creteTypeDetector(TileType.empty, true);
export const isNotEmptyItem = creteTypeDetector(TileType.empty, false);

export const isRoadItem = creteTypeDetector(TileType.road, true);
export const isNotRoadItem = creteTypeDetector(TileType.road, false);
export const isLastRoadItem = (item: Tile) =>
    isRoadItem(item) && 'last' in item && item.last === true;
export const isNotLastRoadItem = (item: Tile) =>
    isRoadItem(item) && 'last' in item && item.last === false;

export const isBuildingItem = creteTypeDetector(TileType.building, true);
export const isNotBuildingItem = creteTypeDetector(TileType.building, false);
