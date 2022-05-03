import { TasksManager } from './TasksManager';

export class FrameTasks extends TasksManager {
    constructor() {
        super((fn) => {
            let id = requestAnimationFrame(function ticker() {
                fn();
                id = requestAnimationFrame(ticker);
            });

            return () => cancelAnimationFrame(id);
        });
    }

    protected exec(): void {
        // Delta between frames we measure in count, not in milliseconds
        this.cbIds.forEach((id) => this.tryExecById(id, 1));
    }
}

export const frameTasks = new FrameTasks();
