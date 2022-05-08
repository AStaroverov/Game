import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import {
    tilesFillEmpty,
    TilesMatrixComponent,
    tilesMove,
} from '../Components/Matrix/TilesMatrixComponent';
import { PositionComponent } from '../Components/PositionComponent';
import { CENTER_CARD_POSITION } from '../CONST';
import { isCardEntity } from '../Entities/Card';
import { isPlayerEntity } from '../Entities/Player';
import { ufloor } from '../utils/math';
import { mapVector, mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function cardSystem(heap: Heap, ticker: TasksScheduler): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const playerPosition = getComponent(playerEntity, PositionComponent);

    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardTiles = getComponent(cardEntity, TilesMatrixComponent);
    const position = getComponent(cardEntity, PositionComponent);

    ticker.addFrameInterval(moveCard, 1);

    function moveCard() {
        const playerPast = sumVector(
            playerPosition,
            mulVector(CENTER_CARD_POSITION, -1),
        );
        const cardDelta = sumVector(playerPast, position);
        const nextPosition = sumVector(position, mulVector(cardDelta, -1));

        const flooredPosition = mapVector(position, ufloor);
        const flooredNextPosition = mapVector(nextPosition, ufloor);
        const diff = sumVector(
            flooredPosition,
            mulVector(flooredNextPosition, -1),
        );

        if (diff.x !== 0 || diff.y !== 0) {
            tilesMove(cardTiles, diff);
            tilesFillEmpty(cardTiles);
        }

        setVector(position, nextPosition);
    }
}
