import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';
import { MeshLambertMaterialParameters } from 'three/src/materials/MeshLambertMaterial';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';
import { $object } from '../../CONST';
import { Size } from '../../utils/shape';

export const MeshComponentID = 'MESH' as const;
export type MeshStruct = ReturnStruct<typeof createMeshComponent>;
export type MeshComponent = ReturnType<typeof createMeshComponent>;
export const createMeshComponent = (
    props?: Partial<
        Size & Pick<MeshLambertMaterialParameters, 'transparent' | 'alphaTest'>
    >,
) =>
    createComponent(MeshComponentID, {
        [$object]: undefined as
            | undefined
            | Mesh<PlaneGeometry, MeshLambertMaterial>,
        ...props,
    });

export function initMeshStruct<
    M extends Mesh<PlaneGeometry, MeshLambertMaterial> = Mesh<
        PlaneGeometry,
        MeshLambertMaterial
    >,
>(struct: MeshStruct): void {
    struct[$object] = new Mesh(
        new PlaneGeometry(struct.w, struct.h),
        new MeshLambertMaterial({
            transparent: struct.transparent,
            alphaTest: struct.alphaTest,
        }),
    );
}
