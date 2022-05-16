import { getComponentBody } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { GameTimeComponentID } from '../Components/GameTime';
import { WorldEntityID } from '../Entities/World';
import { GameHeap } from '../heap';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function gameTimeSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const world = getEntities(heap, WorldEntityID)[0];
    const gameTime = getComponentBody(world, GameTimeComponentID);

    ticker.addTimeInterval(update, 1_000);

    function update(delta: number) {
        gameTime.time += delta;
    }
}
