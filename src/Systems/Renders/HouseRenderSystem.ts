import { Color, Mesh, MeshLambertMaterial, PlaneGeometry, Texture, TextureLoader } from 'three';

import house_4x3_1 from '../../../assets/sprites/houses/houses_128x144_1.png';
import house_4x3_2 from '../../../assets/sprites/houses/houses_128x144_2.png';
import house_4x4_1 from '../../../assets/sprites/houses/houses_128x184_1.png';
import house_4x4_2 from '../../../assets/sprites/houses/houses_128x192_2.png';
// import house_5x3_1 from '../../../assets/sprites/houses/houses_160x144_1.png';
import house_5x4_1 from '../../../assets/sprites/houses/houses_160x192_1.png';
import house_5x4_2 from '../../../assets/sprites/houses/houses_160x192_2.png';
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

const PROMISE_TEX_HOUSE_4x4_1 = new TextureLoader().loadAsync(house_4x4_1);
const PROMISE_TEX_HOUSE_4x3_1 = new TextureLoader().loadAsync(house_4x3_1);
const PROMISE_TEX_HOUSE_4x3_2 = new TextureLoader().loadAsync(house_4x3_2);
const PROMISE_TEX_HOUSE_4x4_2 = new TextureLoader().loadAsync(house_4x4_2);
const PROMISE_TEX_HOUSE_5x4_1 = new TextureLoader().loadAsync(house_5x4_1);
const PROMISE_TEX_HOUSE_5x4_2 = new TextureLoader().loadAsync(house_5x4_2);

export async function HouseRenderSystem(heap: GameHeap, ticker: TasksScheduler) {
    const [
        TEX_HOUSE_4x3_1,
        TEX_HOUSE_4x3_2,
        TEX_HOUSE_4x4_1,
        TEX_HOUSE_4x4_2,
        TEX_HOUSE_5x4_1,
        TEX_HOUSE_5x4_2,
    ] = await Promise.all([
        PROMISE_TEX_HOUSE_4x3_1,
        PROMISE_TEX_HOUSE_4x3_2,
        PROMISE_TEX_HOUSE_4x4_1,
        PROMISE_TEX_HOUSE_4x4_2,
        PROMISE_TEX_HOUSE_5x4_1,
        PROMISE_TEX_HOUSE_5x4_2,
    ]);
    const texturesMap = {
        [getImageKey(4, 3)]: [TEX_HOUSE_4x3_1, TEX_HOUSE_4x3_2],
        [getImageKey(4, 4)]: [TEX_HOUSE_4x4_1, TEX_HOUSE_4x4_2],
        [getImageKey(5, 4)]: [TEX_HOUSE_5x4_1, TEX_HOUSE_5x4_2],
    };

    ticker.addFrameInterval(updateHouses, 2);

    function updateHouses() {
        getEntities(heap, HouseEntityID).forEach((houseEntity) => {
            const meshStruct = getComponentStruct(houseEntity, MeshComponentID);
            const position = getComponentStruct(houseEntity, PositionComponentID);
            const size = getComponentStruct(houseEntity, SizeComponentID);

            if (!shouldInitMesh(meshStruct)) return;

            const mesh = createRandomHouseMesh(texturesMap, size.w, size.h);
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
    w: number,
    h: number,
): Mesh<PlaneGeometry, MeshLambertMaterial> {
    const list = texturesMap[getImageKey(w, h)];

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
