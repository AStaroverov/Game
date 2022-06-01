import { getComponentStruct } from '../../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import {
    initTiles,
    mergeTiles,
    TilesMatrixID,
} from '../../Components/Matrix/TilesMatrix';
import { createVillageMatrix } from '../../Components/Matrix/TilesMatrix/createVillageMatrix';
import { CARD_SIZE, CENTER_CARD_POSITION, RENDER_CARD_SIZE } from '../../CONST';
import { CardEntityID, createCardEntity } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { newSize } from '../../utils/shape';

export function initCardSystem(heap: GameHeap) {
    const cardEntity = getEntities(heap, CardEntityID);

    if (cardEntity.length === 0) {
        const cardEntity = createCardEntity({
            tileSize: newSize(CARD_SIZE),
            meshSize: newSize(RENDER_CARD_SIZE),
        });
        const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);

        addEntity(heap, cardEntity);
        initTiles(cardTiles, CENTER_CARD_POSITION.x, CENTER_CARD_POSITION.y);

        const matrix = createVillageMatrix(7, 7);

        mergeTiles(
            cardTiles,
            matrix,
            CENTER_CARD_POSITION.x - 3,
            CENTER_CARD_POSITION.y - 3,
        );
    }
}
