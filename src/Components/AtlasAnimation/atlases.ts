import { NearestFilter } from 'three';

import playerData from '../../../assets/atlases/player_idle.json';
import playerImage from '../../../assets/atlases/player_idle.png';
import skeletonData from '../../../assets/atlases/skeleton_all.json';
import skeletonImage from '../../../assets/atlases/skeleton_all.png';
import { Atlas } from '../../../lib/Atlas';

const playerAtlas = new Atlas(playerImage, playerData);
const skeletonAtlas = new Atlas(skeletonImage, skeletonData);

[...playerAtlas.list, ...skeletonAtlas.list].forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export enum AtlasName {
    Player = 'Player',
    Skeleton = 'Skeleton',
}

export const atlases = {
    [AtlasName.Player]: playerAtlas,
    [AtlasName.Skeleton]: skeletonAtlas,
};
