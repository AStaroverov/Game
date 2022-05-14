import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { createComponent } from '../../../lib/ECS/Component';
import { TILE_SIZE } from '../../CONST';
import { Size } from '../../utils/shape';
import { createMatrixComponent } from './Matrix';

export const SurfaceMeshesMatrixID = 'SURFACE_MESHES_MATRIX' as const;
export type SurfaceMeshesMatrix = ReturnType<typeof createSurfaceMeshesMatrix>;
export const createSurfaceMeshesMatrix = (props: Size) =>
    createComponent(
        SurfaceMeshesMatrixID,
        createMatrixComponent({
            ...props,
            seed: () => {
                return new Mesh(
                    new PlaneGeometry(TILE_SIZE, TILE_SIZE),
                    new MeshLambertMaterial(),
                );
            },
        }),
    );
