import { SpotLight } from 'three';

import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import {
    initLightStruct,
    SpotLightMeshComponentID,
} from '../../Components/Renders/LightComponent';
import { CENTER_RENDER_POSITION, TILE_SIZE } from '../../CONST';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { GameHeap } from '../../heap';
import { newVector, sumVector } from '../../utils/shape';

const LIGHT_POSITION = sumVector(CENTER_RENDER_POSITION, newVector(-0.5, -0.5));

export function initLightSystem(heap: GameHeap) {
    const globalLight = getEntities(heap, GlobalLightEntityID)[0];
    const lightStruct = getComponentStruct(
        globalLight,
        SpotLightMeshComponentID,
    );
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

    initLightStruct(lightStruct, light);
}
