import { Color, Mesh, MeshLambertMaterial, PlaneGeometry, Texture, TextureLoader } from 'three';

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
import { PositionComponentID } from '../../Components/Position';
import {
    initMeshStruct,
    MeshComponentID,
    shouldInitMesh,
} from '../../Components/Renders/MeshComponent';
import { SizeComponentID } from '../../Components/Size';
import { TILE_SIZE } from '../../CONST';
import { HouseEntityID } from '../../Entities/House';
import { GameHeap } from '../../heap';
import { randomArbitraryFloat, randomArbitraryInt, randomSign } from '../../utils/random';
import { Vector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const PROMISES_TEX_HOUSE_4x3 = Promise.all(
    [house_4x3_1, house_4x3_2, house_4x3_3, house_4x3_4].map((url) =>
        new TextureLoader().loadAsync(url),
    ),
);

const PROMISES_TEX_HOUSE_5x3 = Promise.all(
    [house_5x3_1, house_5x3_2, house_5x3_3].map((url) => new TextureLoader().loadAsync(url)),
);

const PROMISES_TEX_HOUSE_4x4 = Promise.all(
    [house_4x4_1, house_4x4_2, house_4x4_3, house_4x4_4].map((url) =>
        new TextureLoader().loadAsync(url),
    ),
);

const PROMISES_TEX_HOUSE_5x4 = Promise.all(
    [house_5x4_1, house_5x4_2, house_5x4_3, house_5x4_4].map((url) =>
        new TextureLoader().loadAsync(url),
    ),
);

export async function HouseRenderSystem(heap: GameHeap, ticker: TasksScheduler) {
    const texturesMap = {
        [getImageKey(4, 3)]: await PROMISES_TEX_HOUSE_4x3,
        [getImageKey(5, 3)]: await PROMISES_TEX_HOUSE_5x3,
        [getImageKey(4, 4)]: await PROMISES_TEX_HOUSE_4x4,
        [getImageKey(5, 4)]: await PROMISES_TEX_HOUSE_5x4,
    };

    ticker.addFrameInterval(updateHouses, 10);

    function updateHouses() {
        getEntities(heap, HouseEntityID).forEach((houseEntity) => {
            const meshStruct = getComponentStruct(houseEntity, MeshComponentID);
            const position = getComponentStruct(houseEntity, PositionComponentID);
            const size = getComponentStruct(houseEntity, SizeComponentID);

            if (!shouldInitMesh(meshStruct)) return;

            const mesh = createRandomHouseMesh(texturesMap, getImageKey(size.w, size.h));
            const image = mesh.material.map?.image;
            const imageDelta = Vector.create((image.width ?? 0) / 2, (image.height ?? 0) / 2);

            position.x += imageDelta.x / 2 / TILE_SIZE;
            position.y += imageDelta.y / 2 / TILE_SIZE;

            initMeshStruct(meshStruct, mesh);
        });
    }
}

function getImageKey(x: number, y: number): string {
    return 'IMAGE:' + x + '-' + y;
}

function createRandomHouseMesh(
    texturesMap: Record<string, Texture[]>,
    key: string,
): Mesh<PlaneGeometry, MeshLambertMaterial> {
    const list = texturesMap[key];

    return createHouseMesh(list[randomArbitraryInt(0, list.length - 1)]);
}

function createHouseMesh(texture: Texture): Mesh<PlaneGeometry, MeshLambertMaterial> {
    const mesh = new Mesh(
        new PlaneGeometry(texture.image.width, texture.image.height),
        new MeshLambertMaterial({
            map: texture,
            alphaTest: 0.5,
            transparent: true,
        }),
    );
    const v = randomArbitraryFloat(0.8, 1);
    const color = new Color(v, v, v);

    mesh.scale.x = randomSign();
    mesh.material.color = color;

    return mesh;
}
