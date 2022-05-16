import { registerEntity } from '../../lib/ECS/Heap';
import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { createCardEntity } from '../Entities/Card';
import { createGlobalLightEntity } from '../Entities/GlobalLight';
import { createPlayerEntity } from '../Entities/Player';
import { createWorldEntity } from '../Entities/World';
import { createGameHeap } from '../heap';
import { Renderer } from '../Renderer';
import { cardSystem } from '../Systems/cardSystem';
import { colliderSystem } from '../Systems/colliderSystem';
import { controlsSystem } from '../Systems/controlsSystem';
import { gameTimeSystem } from '../Systems/gameTimeSystem';
import { positionBodySystem } from '../Systems/positionBodySystem';
import { newSize } from '../utils/shape';
import { tasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function game(): void {
    const heap = createGameHeap();
    const ticker = tasksScheduler;
    const renderer = new Renderer(ticker);

    // Entities
    const light = createGlobalLightEntity();
    const world = createWorldEntity();
    const card = createCardEntity({
        tileSize: newSize(CARD_SIZE),
        meshSize: newSize(RENDER_CARD_SIZE),
    });
    const player = createPlayerEntity();

    registerEntity(heap, light);
    registerEntity(heap, world);
    registerEntity(heap, card);
    registerEntity(heap, player);

    // Systems
    controlsSystem(heap);

    gameTimeSystem(heap, ticker);
    colliderSystem(heap, ticker);

    positionBodySystem(heap, ticker);
    //
    cardSystem(heap, ticker);
    // playerSystem(heap, ticker);
    // enemySystem(heap, ticker);
    //
    // enemySpawnSystem(heap, ticker);
    //
    // // Render Systems
    // meshesSystem(ticker, renderer.scene, heap);
    // globalLightRenderSystem(heap, ticker);
    //
    // cardSurfaceSystem(ticker, renderer.scene, heap);
    // cardReliefSystem(ticker, renderer.scene, heap);
    //
    // positionRenderSystem(heap, ticker);
    // rotateRenderSystem(heap, ticker);
    // atlasAnimationRenderSystem(heap, ticker);
    //
    // playerRenderSystem(heap, ticker);
    // enemyRenderSystem(heap, ticker);
    //
    // healBarRenderSystem(heap, ticker);

    document.body.append(renderer.renderer.domElement);
}
