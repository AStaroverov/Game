import { CARD_SIZE } from '../CONST';
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
    const sx = Math.floor(CARD_SIZE / 2);
    const sy = Math.floor(CARD_SIZE / 2);

    const card = new Card({ n: CARD_SIZE, m: CARD_SIZE, sx, sy });
    const player = new Player({ x: sx, y: sy });

    // Systems
    controlsSystem({ card, player });

    // Render Entities
    cardRenderSystem(ticker, renderer.scene, { card, player });
    playerRenderSystem(ticker, renderer.scene, { card, player });

    document.body.append(renderer.renderer.domElement);
}
