import { getComponentStruct } from '../../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { updateEnvironment } from '../../Components/Matrix/TilesMatrix/fillers/environment';
import {
    fillCrossroads,
    updateRoads,
} from '../../Components/Matrix/TilesMatrix/fillers/roads';
import { CARD_SIZE, CENTER_CARD_POSITION, RENDER_CARD_SIZE } from '../../CONST';
import { CardEntityID, createCardEntity } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { newSize, zeroVector } from '../../utils/shape';

export function initCardSystem(heap: GameHeap) {
    const cardEntity = getEntities(heap, CardEntityID);

    if (cardEntity.length === 0) {
        const cardEntity = createCardEntity({
            tileSize: newSize(CARD_SIZE),
            meshSize: newSize(RENDER_CARD_SIZE),
        });
        const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);

        addEntity(heap, cardEntity);
        fillCrossroads(cardTiles.matrix, CENTER_CARD_POSITION);
        updateRoads(cardTiles.matrix, zeroVector);
        updateEnvironment(cardTiles.matrix, zeroVector);
        // const matrix = createVillage(21, 17);
        //
        // mergeTiles(
        //     cardTiles,
        //     matrix,
        //     CENTER_CARD_POSITION.x - floor(matrix.w / 2),
        //     CENTER_CARD_POSITION.y - floor(matrix.h / 2),
        // );
    }
}
