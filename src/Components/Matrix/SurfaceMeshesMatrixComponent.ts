import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';
import { $ref } from '../../CONST';
import { Size } from '../../utils/shape';
import { createMatrixComponent } from './Matrix';

export const SurfaceMeshesMatrixID = 'SURFACE_MESHES_MATRIX' as const;
export type SurfaceMeshesMatrixCell = {
    [$ref]: undefined | Mesh<PlaneGeometry, MeshLambertMaterial>;
};
export type SurfaceMeshesMatrix = ReturnStruct<
    typeof createSurfaceMeshesMatrix
>;

export const createSurfaceMeshesMatrix = (props: Size) =>
    createComponent(
        SurfaceMeshesMatrixID,
        createMatrixComponent<SurfaceMeshesMatrixCell>(props),
    );
