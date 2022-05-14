import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { createComponent } from '../../../lib/ECS/Component';
import { Size } from '../../utils/shape';
import { createMatrixComponent } from './Matrix';

export const ReliefMeshesMatrixID = 'RELIEF_MESHES_MATRIX' as const;
export type ReliefMeshesMatrix = ReturnType<typeof createReliefMeshesMatrix>;
export const createReliefMeshesMatrix = (props: Size) =>
    createComponent(
        ReliefMeshesMatrixID,
        createMatrixComponent({
            ...props,
            seed: () => {
                return new Mesh(
                    new PlaneGeometry(),
                    new MeshLambertMaterial({
                        transparent: true,
                        alphaTest: 0.5,
                    }),
                );
            },
        }),
    );
