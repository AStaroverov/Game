import { SpotLight } from 'three';

import { createEntity } from '../../../lib/ECS/Entity';
import { createSpotLightMeshComponent } from '../../Components/Renders/LightComponent';
import { CENTER_RENDER_POSITION, TILE_SIZE } from '../../CONST';
import { newVector, sumVector } from '../../utils/shape';

const LIGHT_POSITION = sumVector(CENTER_RENDER_POSITION, newVector(-0.5, -0.5));

export const GlobalLightEntityID = 'GLOBAL_LIGHT_ENTITY' as const;
export const createGlobalLightEntity = () => {
    const light = new SpotLight(0xffffff);

    light.angle = 0.6;
    light.intensity = 2;
    light.distance = 2000;
    light.penumbra = 0.4;
    light.position.set(
        LIGHT_POSITION.x * TILE_SIZE,
        LIGHT_POSITION.y * TILE_SIZE,
        1000,
    );
    light.target.position.set(
        LIGHT_POSITION.x * TILE_SIZE,
        LIGHT_POSITION.y * TILE_SIZE,
        0,
    );

    return createEntity(GlobalLightEntityID, [
        createSpotLightMeshComponent(light),
    ]);
};
