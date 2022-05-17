import { NearestFilter } from 'three';

import dataAtlasTrees from '../../../assets/atlases/trees.json';
import imageAtlasTrees from '../../../assets/atlases/trees.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/Entity';
import { createReliefMeshesMatrix } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { createSurfaceMeshesMatrix } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { createTilesMatrixComponent } from '../../Components/Matrix/TilesMatrix';
import { createPositionComponent } from '../../Components/Position';
import { Size } from '../../utils/shape';

export const atlasTrees = new Atlas(imageAtlasTrees, dataAtlasTrees);

atlasTrees.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export const CardEntityID = 'CardEntity' as const;
export type CardEntity = ReturnType<typeof createCardEntity>;
export const createCardEntity = (props: { tileSize: Size; meshSize: Size }) =>
    createEntity(CardEntityID, [
        createPositionComponent(),
        createTilesMatrixComponent(props.tileSize),
        createSurfaceMeshesMatrix(props.meshSize),
        createReliefMeshesMatrix(props.meshSize),
    ]);
