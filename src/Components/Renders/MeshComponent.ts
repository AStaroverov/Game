import { DisplayObject } from '@pixi/display';

import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { $ref } from '../../CONST';
import { StageName } from '../../Renderer';
import { TVector, Vector } from '../../utils/shape';

export const MeshComponentID = 'MESH' as const;
export type MeshComponent = ReturnType<typeof createMeshComponent>;
export const createMeshComponent = <T extends DisplayObject>(props: {
    layer: StageName;
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

export function setMeshStruct<M extends DisplayObject = DisplayObject>(
    struct: ExtractStruct<MeshComponent>,
    { mesh, position }: { mesh: M; position?: TVector },
): void {
    struct[$ref] = mesh;
    struct.position = position ?? Vector.ZERO;
}
