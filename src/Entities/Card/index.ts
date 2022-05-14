import { NearestFilter } from 'three';

import dataAtlasTrees from '../../../assets/atlases/trees.json';
import imageAtlasTrees from '../../../assets/atlases/trees.png';
import { Atlas } from '../../../lib/Atlas';
import {
    createEntityConstructor,
    EntityType,
    isEntity,
} from '../../../lib/ECS/entities';
import { PositionConstructor } from '../../Components/Position';
import { Size } from '../../utils/shape';

export const atlasTrees = new Atlas(imageAtlasTrees, dataAtlasTrees);

atlasTrees.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export type CardEntity = EntityType<typeof CardEntityConstructor>;
export const CardEntityConstructor = createEntityConstructor(
    'CardConstructor',
    (props: { tileSize: Size; meshSize: Size }) => [
        PositionConstructor(),
        TilesMatrixConstructor(props.tileSize),
        SurfaceMeshesMatrixConstructor(props.meshSize),
        ReliefMeshesMatrixConstructor(props.meshSize),
    ],
);

export const isCardEntity = isEntity(CardEntityConstructor);
