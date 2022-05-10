import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { GameTimeComponent } from '../Components/GameTime';
import { isWorldEntity } from '../Entities/World';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function gameTimeSystem(heap: Heap, ticker: TasksScheduler): void {
    const world = [...heap.getEntities(isWorldEntity)][0];
    const gameTime = getComponent(world, GameTimeComponent);

    ticker.addTimeInterval(update, 1_000);

    function update(delta: number) {
        gameTime.time += delta;
    }
}
