import { Mesh, MeshLambertMaterial, PlaneGeometry, TextureLoader } from 'three';

import house_1 from '../../../assets/sprites/houses/houses_128x192.png';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import {
    matchBuilding,
    matchNotBuilding,
    matchRoad,
} from '../../Components/Matrix/TilesMatrix/fillers/utils/patterns';
import { PositionComponentID } from '../../Components/Position';
import { TVillage, VillagesComponentID } from '../../Components/Villages';
import { TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { getWorldRenderRect } from '../../utils/getWorldRenderRect';
import { Matrix } from '../../utils/Matrix';
import { TVector } from '../../utils/shape';
import { Rect } from '../../utils/shapes/rect';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { createMeshStore } from '../MeshSystem';

const TEX_HOUSE_1 = new TextureLoader().load(house_1);

const building2x2Pattern = Matrix.getAllVariants(
    Matrix.fromNestedArray([
        /* eslint-disable */
        [matchNotBuilding, matchNotBuilding, matchNotBuilding, matchNotBuilding],
        [matchRoad,        matchBuilding,   matchBuilding,     matchNotBuilding],
        [matchRoad,        matchBuilding,   matchBuilding,     matchNotBuilding],
        [matchNotBuilding, matchNotBuilding, matchNotBuilding, matchNotBuilding],
        /* eslint-enable */
    ]),
);

export function CardVillagesSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardMeshes = createMeshStore(cardEntity);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardVillages = getComponentStruct(cardEntity, VillagesComponentID);

    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(playerEntity, PositionComponentID);

    ticker.addFrameInterval(updateVillages, 1);

    function updateVillages() {
        const village = cardVillages.villages.find((v) => isCurrentVillage(v, cardPosition));

        if (village === undefined || village.matrix === null) {
            cardMeshes.clear();
        } else {
            const places = Matrix.matchAll(village.matrix, building2x2Pattern);

            for (const place of places) {
                const tile = Matrix.get(place, 1, 2)!;
                const mesh = cardMeshes.getset(getKey(tile.x, tile.y), createHouseMesh);

                debugger;
                mesh.position.x = (village.area.w / 4 + tile.x + cardPosition.x) * TILE_SIZE;
                mesh.position.y = (village.area.h / 2 + tile.y + cardPosition.y) * TILE_SIZE;
                mesh.position.z = 10; //tileYToPositionZ(tile.y + floor(cardPosition.y)) + 1;
            }
        }
    }
}

function isCurrentVillage(village: TVillage, cardPosition: TVector): boolean {
    return Rect.intersect(village.area, getWorldRenderRect(cardPosition));
}

function getKey(x: number, y: number): string {
    return 'HOUSE:' + x + '-' + y;
}

function createHouseMesh() {
    return new Mesh(
        new PlaneGeometry(128, 192),
        new MeshLambertMaterial({
            alphaTest: 0.5,
            transparent: true,
            map: TEX_HOUSE_1,
        }),
    );
}
