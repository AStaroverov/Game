import { createHeap } from '../../lib/ECS/heap';
import { CARD_SIZE } from '../CONST';
import { CardEntity } from '../Entities/Card';
import { PlayerEntity } from '../Entities/Player';
import { Renderer } from '../Renderer';
import { cardRenderSystem } from '../RenderSystems/cardRenderSystem';
import { playerRenderSystem } from '../RenderSystems/playerRenderSystem';
import { controlsSystem } from '../Systems/controls';
import { frameTasks } from '../utils/TasksScheduler/frameTasks';

export function game(): void {
    const ticker = frameTasks;
    const renderer = new Renderer(ticker);
    const heap = createHeap();

    // Entities
    const sx = Math.floor(CARD_SIZE / 2);
    const sy = Math.floor(CARD_SIZE / 2);

    const card = CardEntity({ w: CARD_SIZE, h: CARD_SIZE, sx, sy });
    const player = PlayerEntity({ x: sx, y: sy });

    heap.registerEntity(card);
    heap.registerEntity(player);

    // Systems
    controlsSystem(heap);

    // Render Entities
    cardRenderSystem(ticker, renderer.scene, heap);
    playerRenderSystem(ticker, renderer.scene);

    document.body.append(renderer.renderer.domElement);
}
