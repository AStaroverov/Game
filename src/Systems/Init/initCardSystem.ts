import { getComponentStruct } from '../../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import {
    initMatrixTiles,
    TilesMatrixID,
} from '../../Components/Matrix/TilesMatrix';
import { fillEnvironment } from '../../Components/Matrix/TilesMatrix/fillers/fillEnvironment';
import { fillRoads } from '../../Components/Matrix/TilesMatrix/fillers/fillRoads';
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
        initMatrixTiles(cardTiles, CENTER_CARD_POSITION);
        fillRoads(cardTiles, zeroVector);
        fillEnvironment(cardTiles);

        // const matrix = createVillageMatrix(7, 7);
        //
        // mergeTiles(
        //     cardTiles,
        //     matrix,
        //     CENTER_CARD_POSITION.x - 3,
        //     CENTER_CARD_POSITION.y - 3,
        // );
    }
}
