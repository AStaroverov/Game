import { createHeap } from '../../lib/ECS/heap';
import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { CardEntity } from '../Entities/Card';
import { PlayerEntity } from '../Entities/Player';
import { Renderer } from '../Renderer';
import { cardSystem } from '../Systems/cardSystem';
import { colliderSystem } from '../Systems/colliderSystem';
import { controlsSystem } from '../Systems/controlsSystem';
import { playerSystem } from '../Systems/playerSystem';
import { cardReliefSystem } from '../Systems/Renders/cardReliefSystem';
import { cardSurfaceSystem } from '../Systems/Renders/cardSurfaceSystem';
import { playerRenderSystem } from '../Systems/Renders/playerRenderSystem';
import { newSize } from '../utils/shape';
import { tasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function game(): void {
    const ticker = tasksScheduler;
    const renderer = new Renderer(ticker);
    const heap = createHeap();

    // Entities
    const card = new CardEntity({
        tileSize: newSize(CARD_SIZE),
        meshSize: newSize(RENDER_CARD_SIZE),
    });
    const player = new PlayerEntity();

    heap.registerEntity(card);
    heap.registerEntity(player);

    // Systems
    controlsSystem(heap);

    colliderSystem(heap, ticker);

    playerSystem(heap, ticker);
    cardSystem(heap, ticker);

    // Render Systems
    playerRenderSystem(ticker, renderer.scene, heap);
    cardSurfaceSystem(ticker, renderer.scene, heap);
    cardReliefSystem(ticker, renderer.scene, heap);

    document.body.append(renderer.renderer.domElement);
}
