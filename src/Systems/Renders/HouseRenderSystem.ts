import { Texture } from '@pixi/core';
import { BaseTexture } from 'pixi.js';

import house_4x3_1 from '../../../assets/sprites/houses/houses_128x144_1.png';
import house_4x3_2 from '../../../assets/sprites/houses/houses_128x144_2.png';
import house_4x3_3 from '../../../assets/sprites/houses/houses_128x160_3.png';
import house_4x3_4 from '../../../assets/sprites/houses/houses_128x160_4.png';
import house_4x4_1 from '../../../assets/sprites/houses/houses_128x184_1.png';
import house_4x4_2 from '../../../assets/sprites/houses/houses_128x192_2.png';
import house_4x4_3 from '../../../assets/sprites/houses/houses_128x192_3.png';
import house_4x4_4 from '../../../assets/sprites/houses/houses_128x192_4.png';
import house_5x3_1 from '../../../assets/sprites/houses/houses_160x144_1.png';
import house_5x3_2 from '../../../assets/sprites/houses/houses_160x160_2.png';
import house_5x3_3 from '../../../assets/sprites/houses/houses_160x160_3.png';
import house_5x4_1 from '../../../assets/sprites/houses/houses_160x192_1.png';
import house_5x4_2 from '../../../assets/sprites/houses/houses_160x192_2.png';
import house_5x4_3 from '../../../assets/sprites/houses/houses_160x192_3.png';
import house_5x4_4 from '../../../assets/sprites/houses/houses_160x192_4.png';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import {
    MeshComponentID,
    setMeshStruct,
    shouldInitMesh,
} from '../../Components/Renders/MeshComponent';
import { SizeComponentID } from '../../Components/Size';
import { setVisualSize, VisualSizeComponentID } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';
import { HouseEntityID } from '../../Entities/House';
import { GameHeap } from '../../heap';
import { getRandomGreyColor } from '../../utils/getRandomGreyColor';
import { isLoaded } from '../../utils/Pixi/isLoaded';
import { randomArbitraryInt, randomSign } from '../../utils/random';
import { Size, Vector } from '../../utils/shape';
import { Sprite } from '../../utils/Sprite';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const TEX_HOUSE_4x3 = [house_4x3_1, house_4x3_2, house_4x3_3, house_4x3_4].map(
    (url) => new BaseTexture(url),
);

const TEX_HOUSE_5x3 = [house_5x3_1, house_5x3_2, house_5x3_3].map((url) => new BaseTexture(url));

const TEX_HOUSE_4x4 = [house_4x4_1, house_4x4_2, house_4x4_3, house_4x4_4].map(
    (url) => new BaseTexture(url),
);

const TEX_HOUSE_5x4 = [house_5x4_1, house_5x4_2, house_5x4_3, house_5x4_4].map(
    (url) => new BaseTexture(url),
);

const texturesMap = {
    [getImageKey(4, 3)]: TEX_HOUSE_4x3,
    [getImageKey(5, 3)]: TEX_HOUSE_5x3,
    [getImageKey(4, 4)]: TEX_HOUSE_4x4,
    [getImageKey(5, 4)]: TEX_HOUSE_5x4,
};

export function HouseRenderSystem(heap: GameHeap, ticker: TasksScheduler) {
    Promise.all(Object.values(texturesMap).flat().map(isLoaded)).then(() => {
        ticker.addFrameInterval(updateHouses, 10);
    });

    function updateHouses() {
        getEntities(heap, HouseEntityID).forEach((houseEntity) => {
            const meshStruct = getComponentStruct(houseEntity, MeshComponentID);
            const visualSize = getComponentStruct(houseEntity, VisualSizeComponentID);
            const size = getComponentStruct(houseEntity, SizeComponentID);

            if (!shouldInitMesh(meshStruct)) return;

            const base = getRandomBaseTexture(texturesMap, getImageKey(size.w, size.h));
            const mesh = createHouseMesh(base);
            const meshSize = Size.create(base.width / TILE_SIZE, base.height / TILE_SIZE);
            const meshPosition = Vector.create(0, -(meshSize.h - size.h) / 2);

            setVisualSize(visualSize, meshSize);
            setMeshStruct(meshStruct, { mesh, position: meshPosition });
        });
    }
}

function getImageKey(x: number, y: number): string {
    return 'IMAGE:' + x + '-' + y;
}

function getRandomBaseTexture(
    texturesMap: Record<string, BaseTexture[]>,
    key: string,
): BaseTexture {
    const list = texturesMap[key];
    return list[randomArbitraryInt(0, list.length - 1)];
}

function createHouseMesh(base: BaseTexture): Sprite {
    const mesh = new Sprite(new Texture(base));

    mesh.scale.x = randomSign();
    mesh.tint = getRandomGreyColor();

    return mesh;
}
