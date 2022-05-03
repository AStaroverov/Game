import { clearInterval } from 'timers';

import { TasksManager } from './TasksManager';

class MacroTasks extends TasksManager {
    constructor(delay = 8) {
        super((fn) => {
            const id = setInterval(fn, delay);
            return () => clearInterval(id);
        });
    }
}

export const macroTasks = new MacroTasks();
