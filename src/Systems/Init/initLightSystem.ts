import { Texture } from '@pixi/core';
import { BaseTexture, BLEND_MODES, BufferResource, Container } from 'pixi.js';

import ambientImage from '../../../assets/sprites/ambient_light.png';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { Sprite } from '../../Classes/Sprite';
import {
    AmbientLightMeshComponentID,
    setLightStruct,
} from '../../Components/Renders/LightComponent';
import { RENDER_RECT, TILE_SIZE } from '../../CONST';
import { createGlobalLightEntity, GlobalLightEntityID } from '../../Entities/GlobalLight';
import { GameHeap } from '../../heap';
import { isLoaded } from '../../utils/Pixi/isLoaded';

export function InitLightSystem(heap: GameHeap) {
    initGlobalLightEntity(heap);
    initAmbientLight(heap);
}

function initGlobalLightEntity(heap: GameHeap) {
    const globalLight = getEntities(heap, GlobalLightEntityID);

    if (globalLight.length === 0) {
        addEntity(heap, createGlobalLightEntity());
    }
}

async function initAmbientLight(heap: GameHeap) {
    const globalLight = getEntities(heap, GlobalLightEntityID);
    const lightStruct = getComponentStruct(globalLight[0], AmbientLightMeshComponentID);

    const container = new Container();
    const background = new Sprite(
        new Texture(
            new BaseTexture(
                new BufferResource(new Float32Array([0, 0, 0, 0]), { width: 1, height: 1 }),
            ),
        ),
    );
    const ambient = new Sprite(new Texture(await isLoaded(new BaseTexture(ambientImage))));

    container.addChild(background, ambient);
    container.zIndex = 1e10;
    container.position.x = (RENDER_RECT.w / 2) * TILE_SIZE;
    container.position.y = (RENDER_RECT.h / 2) * TILE_SIZE;
    container.alpha = 0.5;

    background.width = 1000;
    background.height = 1000;
    background.alpha = 0.7;

    ambient.width = 1000;
    ambient.height = 1000;
    ambient.blendMode = BLEND_MODES.MULTIPLY;

    setLightStruct(lightStruct, container);
}
