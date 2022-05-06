import { NearestFilter } from 'three';

import dataAtlasTrees from '../../../assets/atlases/trees.json';
import imageAtlasTrees from '../../../assets/atlases/trees.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/entities';
import { ReliefMeshesMatrixComponent } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { SurfaceMeshesMatrixComponent } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { TilesMatrixComponent } from '../../Components/Matrix/TilesMatrixComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { Size } from '../../utils/shape';

export const atlasTrees = new Atlas(imageAtlasTrees, dataAtlasTrees);

atlasTrees.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class CardEntity extends createEntity(
    (props: { tileSize: Size; meshSize: Size }) => [
        new PositionComponent(),
        new TilesMatrixComponent(props.tileSize),
        new SurfaceMeshesMatrixComponent(props.meshSize),
        new ReliefMeshesMatrixComponent(props.meshSize),
    ],
) {}

export const isCardEntity = (
    entity: CardEntity | unknown,
): entity is CardEntity => entity instanceof CardEntity;
