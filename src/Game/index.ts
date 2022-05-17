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
import { enemySpawnSystem } from '../Systems/enemySpawnSystem';
import { enemySystem } from '../Systems/enemySystem';
import { gameTimeSystem } from '../Systems/gameTimeSystem';
import { playerSystem } from '../Systems/playerSystem';
import { positionBodySystem } from '../Systems/positionBodySystem';
import { atlasAnimationRenderSystem } from '../Systems/Renders/atlasAnimationRenderSystem';
import { cardReliefSystem } from '../Systems/Renders/cardReliefSystem';
import { cardSurfaceSystem } from '../Systems/Renders/cardSurfaceSystem';
import { enemyRenderSystem } from '../Systems/Renders/enemyRenderSystem';
import { globalLightRenderSystem } from '../Systems/Renders/globalLightRenderSystem';
import { healBarRenderSystem } from '../Systems/Renders/healBarRenderSystem';
import { meshesSystem } from '../Systems/Renders/meshesSystem';
import { playerRenderSystem } from '../Systems/Renders/playerRenderSystem';
import { positionRenderSystem } from '../Systems/Renders/positionRenderSystem';
import { rotateRenderSystem } from '../Systems/Renders/rotateRenderSystem';
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

    cardSystem(heap, ticker);
    playerSystem(heap, ticker);
    enemySystem(heap, ticker);

    enemySpawnSystem(heap, ticker);

    // Render Systems
    meshesSystem(heap, ticker, renderer.scene);
    globalLightRenderSystem(heap, ticker);

    cardSurfaceSystem(heap, ticker);
    cardReliefSystem(heap, ticker);

    positionRenderSystem(heap, ticker);
    rotateRenderSystem(heap, ticker);
    atlasAnimationRenderSystem(heap, ticker);

    playerRenderSystem(heap, ticker);
    enemyRenderSystem(heap, ticker);

    healBarRenderSystem(heap, ticker);

    document.body.append(renderer.renderer.domElement);
}
