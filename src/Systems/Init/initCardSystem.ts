import { getComponentStruct } from '../../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { tilesInit, TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
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
        tilesInit(cardTiles, CENTER_CARD_POSITION.x, CENTER_CARD_POSITION.y);
    }
}
