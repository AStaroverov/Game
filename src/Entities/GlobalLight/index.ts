import { SpotLight } from 'three';

import { Entity } from '../../../lib/ECS/entities';
import { SpotLightMeshComponent } from '../../Components/Renders/LightComponent';
import { CENTER_RENDER_POSITION, TILE_SIZE } from '../../CONST';
import { newVector, sumVector } from '../../utils/shape';

const LIGHT_POSITION = sumVector(CENTER_RENDER_POSITION, newVector(-0.5, -0.5));

export class GlobalLightEntity extends Entity {
    constructor() {
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

        super([new SpotLightMeshComponent(light)]);
    }
}

export const isGlobalLightEntity = (
    entity: GlobalLightEntity | unknown,
): entity is GlobalLightEntity => entity instanceof GlobalLightEntity;
