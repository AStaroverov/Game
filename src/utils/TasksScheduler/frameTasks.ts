import { TasksManager, TCallbackId } from './TasksManager';

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

    protected tryExecById(
        id: TCallbackId,
        metaDelta: number,
        timeDelta: number,
    ): void {
        super.tryExecById(id, 1, timeDelta);
    }
}

export const frameTasks = new FrameTasks();
