import { Mesh } from 'three';
import { Object3D } from 'three/src/core/Object3D';

import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { $ref } from '../../CONST';
import { Layer } from '../../Renderer';

export const MeshComponentID = 'MESH' as const;
export type MeshComponent = ReturnType<typeof createMeshComponent>;
export const createMeshComponent = <T extends Object3D>(layer: Layer) =>
    createComponent(MeshComponentID, {
        layer,
        [$ref]: undefined as undefined | T,
    });

export function shouldInitMesh(struct: ExtractStruct<MeshComponent>) {
    return struct[$ref] === undefined;
}

export function initMeshStruct<M extends Object3D = Object3D>(
    struct: ExtractStruct<MeshComponent>,
    mesh: Mesh,
): void {
    struct[$ref] = mesh;
}
