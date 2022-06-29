import { createEntity } from '../../../lib/ECS/Entity';
import { createReliefMeshesMatrix } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { createSurfaceMeshesMatrix } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { createTilesMatrixComponent } from '../../Components/Matrix/TilesMatrix';
import { createPositionComponent } from '../../Components/Position';
import { createVillagesComponent } from '../../Components/Villages';
import { CARD_START_DELTA } from '../../CONST';
import { TSize } from '../../utils/shape';

export const CardEntityID = 'CARD_ENTITY' as const;
export type CardEntity = ReturnType<typeof createCardEntity>;
export const createCardEntity = (props: { tileSize: TSize; meshSize: TSize }) =>
    createEntity(CardEntityID, [
        createPositionComponent(CARD_START_DELTA),
        createTilesMatrixComponent(props.tileSize),
        createSurfaceMeshesMatrix(props.meshSize),
        createReliefMeshesMatrix(props.meshSize),
        createVillagesComponent(),
    ]);
