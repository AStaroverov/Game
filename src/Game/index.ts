import { createHeap } from '../../lib/ECS/heap';
import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { CardEntity } from '../Entities/Card';
import { PlayerEntity } from '../Entities/Player';
import { Renderer } from '../Renderer';
import { cardSystem } from '../Systems/cardSystem';
import { colliderSystem } from '../Systems/colliderSystem';
import { controlsSystem } from '../Systems/controlsSystem';
import { enemySpawnSystem } from '../Systems/enemySpawnSystem';
import { playerSystem } from '../Systems/playerSystem';
import { atlasAnimationRenderSystem } from '../Systems/Renders/atlasAnimationRenderSystem';
import { cardReliefSystem } from '../Systems/Renders/cardReliefSystem';
import { cardSurfaceSystem } from '../Systems/Renders/cardSurfaceSystem';
import { enemyRenderSystem } from '../Systems/Renders/enemyRenderSystem';
import { meshesSystem } from '../Systems/Renders/meshesSystem';
import { playerRenderSystem } from '../Systems/Renders/playerRenderSystem';
import { positionBodyRenderSystem } from '../Systems/Renders/positionBodyRenderSystem';
import { rotateBodyRenderSystem } from '../Systems/Renders/rotateBodyRenderSystem';
import { newSize } from '../utils/shape';
import { tasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function game(): void {
    const heap = createHeap();
    const ticker = tasksScheduler;
    const renderer = new Renderer(ticker);

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

    enemySpawnSystem(heap, ticker);

    // Render Systems
    meshesSystem(ticker, renderer.scene, heap);

    cardSurfaceSystem(ticker, renderer.scene, heap);
    cardReliefSystem(ticker, renderer.scene, heap);

    positionBodyRenderSystem(heap, ticker);
    rotateBodyRenderSystem(heap, ticker);
    atlasAnimationRenderSystem(heap, ticker);

    playerRenderSystem(heap, ticker);
    enemyRenderSystem(heap, ticker);

    document.body.append(renderer.renderer.domElement);
}
