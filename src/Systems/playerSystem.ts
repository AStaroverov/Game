import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { PositionComponentID } from '../Components/Position';
import { CENTER_CARD_POSITION } from '../CONST';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { mapVector, setVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export const PLAYER_START_POSITION = mapVector(
    CENTER_CARD_POSITION,
    (v) => v + 0.5,
);

export function playerSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(
        playerEntity,
        PositionComponentID,
    );

    setVector(playerPosition, PLAYER_START_POSITION);
}
