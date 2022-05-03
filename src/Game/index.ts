import { Card } from '../Entities/Card';
import { Player } from '../Entities/Player';
import { Renderer } from '../Renderer';
import { cardRenderSystem } from '../RenderSystems/cardRenderSystem';
import { playerRenderSystem } from '../RenderSystems/playerRenderSystem';
import { controlsSystem } from '../Systems/controls';
import { frameTasks } from '../utils/TasksScheduler/frameTasks';

export function game(): void {
    const ticker = frameTasks;
    const renderer = new Renderer(ticker);

    // Entities
    const card = new Card({ n: 10, m: 10 });
    const player = new Player({ x: 3, y: 3 });

    // Systems
    controlsSystem({ card, player });

    // Render Entities
    cardRenderSystem(ticker, renderer.scene, { card, player });
    playerRenderSystem(ticker, renderer.scene, { card, player });

    document.body.append(renderer.renderer.domElement);
}
