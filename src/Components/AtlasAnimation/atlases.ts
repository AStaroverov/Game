import dataGross from '../../../assets/atlases/gross_1.json';
import imageGross from '../../../assets/atlases/gross_1.png';
import playerData from '../../../assets/atlases/player_idle.json';
import playerImage from '../../../assets/atlases/player_idle.png';
import dataRoad from '../../../assets/atlases/road_1.json';
import imageRoad from '../../../assets/atlases/road_1.png';
import skeletonData from '../../../assets/atlases/skeleton_all.json';
import skeletonImage from '../../../assets/atlases/skeleton_all.png';
import treesData from '../../../assets/atlases/trees.json';
import treesImage from '../../../assets/atlases/trees.png';
import { PixiAtlas } from '../../../lib/PixiAtlas';

export enum AtlasName {
    Road = 'Road',
    Gross = 'Gross',
    Tree = 'Tree',
    Player = 'Player',
    Skeleton = 'Skeleton',
}

export const atlases = {
    [AtlasName.Road]: new PixiAtlas(imageRoad, dataRoad),
    [AtlasName.Gross]: new PixiAtlas(imageGross, dataGross),
    [AtlasName.Tree]: new PixiAtlas(treesImage, treesData),
    [AtlasName.Player]: new PixiAtlas(playerImage, playerData),
    [AtlasName.Skeleton]: new PixiAtlas(skeletonImage, skeletonData),
};
