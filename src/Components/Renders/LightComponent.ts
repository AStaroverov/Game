import { Light, SpotLight } from 'three';

import { createComponent } from '../../../lib/ECS/Component';

export const LightMeshComponentID = 'LIGHT_MESH' as const;
export const createLightMeshComponent = <L extends Light>(object: L) =>
    createComponent(LightMeshComponentID, {
        object,
    });

export const SpotLightMeshComponentID = 'SPOT_LIGHT_MESH' as const;
export const createSpotLightMeshComponent = <L extends SpotLight>(object: L) =>
    createComponent(SpotLightMeshComponentID, createLightMeshComponent(object));
