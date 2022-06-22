import { isBuildingTile, isNotBuildingTile, isRoadTile } from './is';

export const matchRoad = {
    match: isRoadTile,
};

export const matchBuilding = {
    match: isBuildingTile,
};

export const matchNotBuilding = {
    match: isNotBuildingTile,
};
