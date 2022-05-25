import { Light, SpotLight } from 'three';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';
import { $object } from '../../CONST';

export const LightMeshComponentID = 'LIGHT_MESH' as const;
export type LightMeshStruct = ReturnStruct<typeof createLightMeshComponent>;
export type LightMeshComponent = ReturnType<typeof createLightMeshComponent>;
export const createLightMeshComponent = <L extends Light>() =>
    createComponent(LightMeshComponentID, {
        [$object]: undefined as undefined | L,
    });

export const SpotLightMeshComponentID = 'SPOT_LIGHT_MESH' as const;
export type SpotLightMeshComponent = ReturnType<
    typeof createSpotLightMeshComponent
>;
export const createSpotLightMeshComponent = () =>
    createComponent(
        SpotLightMeshComponentID,
        createLightMeshComponent<SpotLight>(),
    );

export function initLightStruct<T extends Light>(
    struct: LightMeshStruct,
    light: T = new Light() as T,
): void {
    struct[$object] = light;
}
