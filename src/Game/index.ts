import { getComponent } from '../../lib/ECS/entities';
import { createHeap } from '../../lib/ECS/heap';
import { TilesComponent, tilesFillEmpty } from '../Components/TilesComponent';
import { CARD_SIZE } from '../CONST';
import { CardEntity } from '../Entities/Card';
import { PlayerEntity } from '../Entities/Player';
import { Renderer } from '../Renderer';
import { cardRenderSystem } from '../RenderSystems/cardRenderSystem';
import { controlsSystem } from '../Systems/controlsSystems';
import { playerSystem } from '../Systems/playerSystem';
import { frameTasks } from '../utils/TasksScheduler/frameTasks';

export function game(): void {
    const ticker = frameTasks;
    const renderer = new Renderer(ticker);
    const heap = createHeap();

    // Entities
    const sx = Math.floor(CARD_SIZE / 2);
    const sy = Math.floor(CARD_SIZE / 2);

    const card = new CardEntity({ w: CARD_SIZE, h: CARD_SIZE, sx, sy });
    const player = new PlayerEntity({ x: sx, y: sy });

    heap.registerEntity(card);
    heap.registerEntity(player);

    tilesFillEmpty(getComponent(card, TilesComponent));

    // Systems
    controlsSystem(heap);

    // Render Entities
    cardRenderSystem(ticker, renderer.scene, heap);
    playerSystem(ticker, renderer.scene, heap);

    document.body.append(renderer.renderer.domElement);
}
