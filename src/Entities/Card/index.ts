import { NearestFilter } from 'three';

import dataAtlasTrees from '../../../assets/atlases/trees.json';
import imageAtlasTrees from '../../../assets/atlases/trees.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/Entity';
import { createReliefMeshesMatrix } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { createSurfaceMeshesMatrix } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { createTilesMatrixComponent } from '../../Components/Matrix/TilesMatrix';
import { createPositionComponent } from '../../Components/Position';
import { PLAYER_START_DELTA } from '../../CONST';
import { negateVector, Size } from '../../utils/shape';

export const atlasTrees = new Atlas(imageAtlasTrees, dataAtlasTrees);

atlasTrees.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export const CardEntityID = 'CARD_ENTITY' as const;
export type CardEntity = ReturnType<typeof createCardEntity>;
export const createCardEntity = (props: { tileSize: Size; meshSize: Size }) =>
    createEntity(CardEntityID, [
        createPositionComponent(negateVector(PLAYER_START_DELTA)),
        createTilesMatrixComponent(props.tileSize),
        createSurfaceMeshesMatrix(props.meshSize),
        createReliefMeshesMatrix(props.meshSize),
    ]);
