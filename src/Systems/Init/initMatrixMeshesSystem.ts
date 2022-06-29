import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { Sprite } from '../../Classes/Sprite';
import {
    ReliefMeshesMatrix,
    ReliefMeshesMatrixID,
} from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import {
    SurfaceMeshesMatrix,
    SurfaceMeshesMatrixID,
} from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { $ref } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { Matrix } from '../../utils/Matrix';

export function initMatrixMeshesSystem(heap: GameHeap) {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const reliefMeshesMatrix = getComponentStruct(cardEntity, ReliefMeshesMatrixID);
    const surfaceMeshesMatrix = getComponentStruct(cardEntity, SurfaceMeshesMatrixID);

    initSurfaceMeshMatrix(surfaceMeshesMatrix);
    initReliefMeshMatrix(reliefMeshesMatrix);
}

function initReliefMeshMatrix(meshesMatrix: ReliefMeshesMatrix) {
    Matrix.fill(meshesMatrix.matrix, () => {
        return {
            [$ref]: new Sprite(),
        };
    });
}

function initSurfaceMeshMatrix(meshesMatrix: SurfaceMeshesMatrix) {
    Matrix.fill(meshesMatrix.matrix, () => {
        return {
            [$ref]: new Sprite(),
        };
    });
}
