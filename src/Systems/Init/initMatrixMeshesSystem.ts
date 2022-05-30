import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import {
    ReliefMeshesMatrix,
    ReliefMeshesMatrixID,
} from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import {
    SurfaceMeshesMatrix,
    SurfaceMeshesMatrixID,
} from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { $ref, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { Matrix } from '../../utils/Matrix';

export function initMatrixMeshesSystem(heap: GameHeap) {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const reliefMeshesMatrix = getComponentStruct(
        cardEntity,
        ReliefMeshesMatrixID,
    );
    const surfaceMeshesMatrix = getComponentStruct(
        cardEntity,
        SurfaceMeshesMatrixID,
    );

    initReliefMeshMatrix(reliefMeshesMatrix);
    initSurfaceMeshMatrix(surfaceMeshesMatrix);
}

function initReliefMeshMatrix(meshesMatrix: ReliefMeshesMatrix) {
    Matrix.fill(meshesMatrix.matrix, () => {
        return {
            [$ref]: new Mesh(
                new PlaneGeometry(),
                new MeshLambertMaterial({
                    transparent: true,
                    alphaTest: 0.5,
                }),
            ),
        };
    });
}

function initSurfaceMeshMatrix(meshesMatrix: SurfaceMeshesMatrix) {
    Matrix.fill(meshesMatrix.matrix, () => {
        return {
            [$ref]: new Mesh(
                new PlaneGeometry(TILE_SIZE, TILE_SIZE),
                new MeshLambertMaterial(),
            ),
        };
    });
}
