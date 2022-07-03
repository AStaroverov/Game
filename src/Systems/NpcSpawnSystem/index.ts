import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { UpdateFirstNPC } from './UpdateFirstNPC';

export function NpcSpawnSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const updates = new Set([UpdateFirstNPC(heap)]);

    ticker.addTimeInterval(() => {
        for (const update of updates) {
            if (update()) updates.delete(update);
        }
    }, 100);
}
