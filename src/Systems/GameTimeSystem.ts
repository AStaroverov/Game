import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { GameTimeComponentID } from '../Components/GameTime';
import { WorldEntityID } from '../Entities/World';
import { GameHeap } from '../heap';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function GameTimeSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const world = getEntities(heap, WorldEntityID)[0];
    const gameTime = getComponentStruct(world, GameTimeComponentID);

    ticker.addTimeInterval(update, 100);

    function update() {
        gameTime.time += 100;
    }
}
