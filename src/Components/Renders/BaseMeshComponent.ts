import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';
import { MeshLambertMaterialParameters } from 'three/src/materials/MeshLambertMaterial';

import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { $object } from '../../CONST';
import { Layer } from '../../Renderer';
import { Size } from '../../utils/shape';
import { createMeshComponent } from './MeshComponent';

type BaseMesh = Mesh<PlaneGeometry, MeshLambertMaterial>;

export const BaseMeshComponentID = 'BASE_MESH' as const;
export type BaseMeshComponent = ReturnType<typeof createBaseMeshComponent>;
export const createBaseMeshComponent = (
    props: Partial<
        Size & Pick<MeshLambertMaterialParameters, 'transparent' | 'alphaTest'>
    >,
) =>
    createComponent(
        BaseMeshComponentID,
        props,
        createMeshComponent<BaseMesh>(Layer.Main),
    );

export function initBaseMeshStruct<M extends BaseMesh = BaseMesh>(
    struct: ExtractStruct<BaseMeshComponent>,
): void {
    struct[$object] = new Mesh(
        new PlaneGeometry(struct.w, struct.h),
        new MeshLambertMaterial({
            transparent: struct.transparent,
            alphaTest: struct.alphaTest,
        }),
    );
}
