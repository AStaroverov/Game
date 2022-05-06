import { createHeap } from '../../lib/ECS/heap';
import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { CardEntity } from '../Entities/Card';
import { PlayerEntity } from '../Entities/Player';
import { Renderer } from '../Renderer';
import { cardReliefSystem } from '../Systems/cardReliefSystem';
import { cardSurfaceSystem } from '../Systems/cardSurfaceSystem';
import { controlsSystem } from '../Systems/controlsSystems';
import { playerSystem } from '../Systems/playerSystem';
import { newSize } from '../utils/shape';
import { frameTasks } from '../utils/TasksScheduler/frameTasks';

export function game(): void {
    const ticker = frameTasks;
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
    cardSurfaceSystem(ticker, renderer.scene, heap);
    cardReliefSystem(ticker, renderer.scene, heap);
    playerSystem(ticker, renderer.scene, heap);

    controlsSystem(heap);

    document.body.append(renderer.renderer.domElement);
}
