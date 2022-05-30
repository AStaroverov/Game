import { Object3D } from 'three/src/core/Object3D';

import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { $object } from '../../CONST';
import { Layer } from '../../Renderer';

export const MeshComponentID = 'MESH' as const;
export type MeshComponent = ReturnType<typeof createMeshComponent>;
export const createMeshComponent = <T extends Object3D>(layer: Layer) =>
    createComponent(MeshComponentID, {
        layer,
        [$object]: undefined as undefined | T,
    });

export function shouldInitMesh(struct: ExtractStruct<MeshComponent>) {
    return struct[$object] === undefined;
}
