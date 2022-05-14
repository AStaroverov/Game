import { NearestFilter } from 'three';

import dataAtlasTrees from '../../../assets/atlases/trees.json';
import imageAtlasTrees from '../../../assets/atlases/trees.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity, Entity, isEntity } from '../../../lib/ECS/Entity';
import { createReliefMeshesMatrix } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { createSurfaceMeshesMatrix } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { createTilesMatrix } from '../../Components/Matrix/TilesMatrix';
import { createPosition } from '../../Components/Position';
import { Size } from '../../utils/shape';

export const atlasTrees = new Atlas(imageAtlasTrees, dataAtlasTrees);

atlasTrees.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export const CardEntityID = 'CardEntity' as const;
export type CardEntity = ReturnType<typeof createCardEntity>;
export const createCardEntity = (props: { tileSize: Size; meshSize: Size }) =>
    createEntity(typeof CardEntityID, [
        createPosition(),
        createTilesMatrix(props.tileSize),
        createSurfaceMeshesMatrix(props.meshSize),
        createReliefMeshesMatrix(props.meshSize),
    ]);

export const isCardEntity = (e: Entity): e is CardEntity =>
    isEntity(e, CardEntityID);
