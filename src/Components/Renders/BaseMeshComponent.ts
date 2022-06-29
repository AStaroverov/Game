import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { Sprite } from '../../Classes/Sprite';
import { $ref } from '../../CONST';
import { StageName } from '../../Renderer';
import { createMeshComponent } from './MeshComponent';

type BaseMesh = Sprite;

// TODO: Rename to SpriteComponent?
export const BaseMeshComponentID = 'BASE_MESH' as const;
export type BaseMeshComponent = ReturnType<typeof createBaseMeshComponent>;
export const createBaseMeshComponent = () =>
    createComponent(BaseMeshComponentID, createMeshComponent<BaseMesh>({ layer: StageName.Main }));

export function initBaseMeshStruct<M extends BaseMesh = BaseMesh>(
    struct: ExtractStruct<BaseMeshComponent>,
): void {
    struct[$ref] = new Sprite();
}
