import { DisplayObject } from '@pixi/display';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';
import { Sprite } from '../../Classes/Sprite';
import { $ref } from '../../CONST';

export const LightMeshComponentID = 'LIGHT_MESH' as const;
export type LightMeshStruct = ReturnStruct<typeof createLightMeshComponent>;
export type LightMeshComponent = ReturnType<typeof createLightMeshComponent>;
export const createLightMeshComponent = <L extends DisplayObject>() =>
    createComponent(LightMeshComponentID, {
        [$ref]: undefined as undefined | L,
    });

export const AmbientLightMeshComponentID = 'SPOT_LIGHT_MESH' as const;
export type AmbientLightMeshComponent = ReturnType<typeof createAmbientLightMeshComponent>;
export const createAmbientLightMeshComponent = () =>
    createComponent(AmbientLightMeshComponentID, createLightMeshComponent<Sprite>());

export function setLightStruct<T extends DisplayObject>(struct: LightMeshStruct, light: T): void {
    struct[$ref] = light;
}
