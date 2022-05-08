import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { DirectionComponent } from '../Components/DirectionComponent';
import { PositionComponent } from '../Components/PositionComponent';
import { VelocityComponent } from '../Components/VelocityComponent';
import { CENTER_CARD_POSITION } from '../CONST';
import { isPlayerEntity } from '../Entities/Player';
import { mapVector, mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export const PLAYER_START_POSITION = mapVector(
    CENTER_CARD_POSITION,
    (v) => v + 0.5,
);

export function playerSystem(heap: Heap, ticker: TasksScheduler): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const playerPosition = getComponent(playerEntity, PositionComponent);
    const playerDirection = getComponent(playerEntity, DirectionComponent);
    const playerVelocity = getComponent(playerEntity, VelocityComponent);

    setVector(playerPosition, PLAYER_START_POSITION);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        setVector(
            playerPosition,
            sumVector(
                playerPosition,
                mulVector(playerDirection, playerVelocity.v),
            ),
        );
    }
}
