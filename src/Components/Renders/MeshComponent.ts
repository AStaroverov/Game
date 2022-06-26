import { Mesh } from 'three';
import { Object3D } from 'three/src/core/Object3D';

import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { $ref } from '../../CONST';
import { Layer } from '../../Renderer';
import { TVector, Vector } from '../../utils/shape';

export const MeshComponentID = 'MESH' as const;
export type MeshComponent = ReturnType<typeof createMeshComponent>;
export const createMeshComponent = <T extends Object3D>(props: {
    layer: Layer;
    position?: TVector;
}) =>
    createComponent(MeshComponentID, {
        [$ref]: undefined as undefined | T,
        position: Vector.ZERO,
        ...props,
    });

export function shouldInitMesh(struct: ExtractStruct<MeshComponent>) {
    return struct[$ref] === undefined;
}

export function initMeshStruct<M extends Object3D = Object3D>(
    struct: ExtractStruct<MeshComponent>,
    { mesh, position }: { mesh: Mesh; position?: TVector },
): void {
    struct[$ref] = mesh;
    struct.position = position ?? Vector.ZERO;
}
