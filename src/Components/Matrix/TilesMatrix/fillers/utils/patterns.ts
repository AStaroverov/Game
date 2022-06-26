import {
    isBuildingTile,
    isNotBuildingTile,
    isNotLastRoadTile,
    isNotRoadTile,
    isRoadTile,
} from './is';

export const matchRoad = {
    match: isRoadTile,
};

export const matchNotLastRoad = {
    match: isNotLastRoadTile,
};

export const matchNotRoad = {
    match: isNotRoadTile,
};

export const matchBuilding = {
    match: isBuildingTile,
};

export const matchNotBuilding = {
    match: isNotBuildingTile,
};
