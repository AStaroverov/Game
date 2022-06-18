import { Callback, CallbackType, TasksManager } from './TasksManager';

export class TasksScheduler extends TasksManager {
    constructor() {
        super((fn) => {
            let id = requestAnimationFrame(function ticker() {
                fn();
                id = requestAnimationFrame(ticker);
            });

            return () => cancelAnimationFrame(id);
        });
    }

    addFrameInterval(cb: Callback, delay: number, ctx: unknown = null): VoidFunction {
        return this.addTask(cb, {
            ctx,
            delay,
            type: CallbackType.frame,
            times: Infinity,
        });
    }

    addFrameOut(cb: Callback, delay: number, ctx: unknown = null): VoidFunction {
        return this.addTask(cb, {
            ctx,
            delay,
            type: CallbackType.frame,
            times: 1,
        });
    }

    addTimeInterval(cb: Callback, delay: number, ctx: unknown = null): VoidFunction {
        return this.addTask(cb, {
            ctx,
            delay,
            type: CallbackType.time,
            times: Infinity,
        });
    }

    addTimeout(cb: Callback, delay: number, ctx: unknown = null): VoidFunction {
        return this.addTask(cb, {
            ctx,
            delay,
            type: CallbackType.time,
            times: 1,
        });
    }
}

export const tasksScheduler = new TasksScheduler();
