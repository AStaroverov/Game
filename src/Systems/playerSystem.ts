import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { PositionComponent } from '../Components/PositionComponent';
import { CENTER_CARD_POSITION } from '../CONST';
import { isPlayerEntity } from '../Entities/Player';
import { mapVector, setVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export const PLAYER_START_POSITION = mapVector(
    CENTER_CARD_POSITION,
    (v) => v + 0.5,
);

export function playerSystem(heap: Heap, ticker: TasksScheduler): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const playerPosition = getComponent(playerEntity, PositionComponent);

    setVector(playerPosition, PLAYER_START_POSITION);
}
