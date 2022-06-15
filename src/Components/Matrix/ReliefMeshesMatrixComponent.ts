import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';
import { $ref } from '../../CONST';
import { TSize } from '../../utils/shape';
import { createMatrixComponent } from './Matrix';

export const ReliefMeshesMatrixID = 'RELIEF_MESHES_MATRIX' as const;
export type ReliefMeshesMatrix = ReturnStruct<typeof createReliefMeshesMatrix>;
export type ReliefMeshesMatrixCell = {
    [$ref]: undefined | Mesh<PlaneGeometry, MeshLambertMaterial>;
};
export const createReliefMeshesMatrix = (props: TSize) =>
    createComponent(ReliefMeshesMatrixID, createMatrixComponent<ReliefMeshesMatrixCell>(props));
