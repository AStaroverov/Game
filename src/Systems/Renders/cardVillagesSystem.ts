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
import { CARD_START_DELTA, RENDER_RECT, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { getWorldRenderRect } from '../../utils/getWorldRenderRect';
import { Matrix } from '../../utils/Matrix';
import { worldYToPositionZ } from '../../utils/positionZ';
import { TVector, Vector } from '../../utils/shape';
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
        if (TEX_HOUSE_1.image === undefined) return;

        const village = cardVillages.villages.find((v) => isCurrentVillage(v, cardPosition));

        if (village === undefined || village.matrix === null) {
            cardMeshes.clear();
        } else {
            const places = Matrix.matchAll(village.matrix, building2x2Pattern);

            for (const place of places) {
                const tile = Matrix.get(place, 1, 1)!;
                const mesh = cardMeshes.getset(getKey(tile.x, tile.y), createHouseMesh);
                const tileWorldPosition = Vector.create(
                    village.area.x + tile.x,
                    village.area.y + tile.y,
                );
                const renderDelta = Vector.create(
                    cardPosition.x + CARD_START_DELTA.x - RENDER_RECT.x - 1, // wtf 1?
                    cardPosition.y + CARD_START_DELTA.y - RENDER_RECT.y - 1,
                );
                const imageDelta = Vector.create(
                    TEX_HOUSE_1.image.width / 2,
                    TEX_HOUSE_1.image.height / 2,
                );

                mesh.position.x = (tileWorldPosition.x + renderDelta.x) * TILE_SIZE + imageDelta.x;
                mesh.position.y = (tileWorldPosition.y + renderDelta.y) * TILE_SIZE + imageDelta.y;
                mesh.position.z = worldYToPositionZ(mesh.position.y);
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
        new PlaneGeometry(TEX_HOUSE_1.image.width, TEX_HOUSE_1.image.height),
        new MeshLambertMaterial({
            map: TEX_HOUSE_1,
            alphaTest: 0.5,
            transparent: true,
        }),
    );
}
