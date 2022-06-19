import { tasksScheduler } from './TasksScheduler/TasksScheduler';

export const supportedFps = [60, 120, 90, 144, 30];
export const supportedTick = supportedFps.map((fps) => 1e3 / fps);
export let TICK_TIME = supportedTick[0];

tasksScheduler.addFrameInterval((delta) => {
    for (let i = 0; i < supportedTick.length; i++) {
        if (supportedTick[i] - delta < 3) {
            TICK_TIME = supportedTick[i];
            break;
        }
    }
}, 1);
