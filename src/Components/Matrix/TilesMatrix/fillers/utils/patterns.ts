import { isBuildingItem, isNotBuildingItem, isRoadItem } from './is';

export const matchRoad = {
    match: isRoadItem,
};

export const matchBuilding = {
    match: isBuildingItem,
};

export const matchNotBuilding = {
    match: isNotBuildingItem,
};
