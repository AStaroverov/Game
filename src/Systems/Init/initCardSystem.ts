import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { tilesInit, TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { CENTER_CARD_POSITION } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';

export function initCardSystem(heap: GameHeap) {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);

    tilesInit(cardTiles, CENTER_CARD_POSITION.x, CENTER_CARD_POSITION.y);
}
