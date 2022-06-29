import { Renderer } from '../../Renderer';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function RenderSystem(ticker: TasksScheduler, renderer: Renderer): void {
    ticker.addFrameInterval(() => {
        renderer.render();
    }, 1);
}
