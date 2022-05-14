import { registerEntity } from '../../lib/ECS/Heap';
import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { createCardEntity } from '../Entities/Card';
import { heap } from '../heap';
import { Renderer } from '../Renderer';
import { cardSystem } from '../Systems/cardSystem';
import { enemySpawnSystem } from '../Systems/enemySpawnSystem';
import { enemySystem } from '../Systems/enemySystem';
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
    const ticker = tasksScheduler;
    const renderer = new Renderer(ticker);

    // Entities
    // const light = new GlobalLightEntity();
    // const world = new WorldEntity();
    const card = createCardEntity({
        tileSize: newSize(CARD_SIZE),
        meshSize: newSize(RENDER_CARD_SIZE),
    });
    // const player = new PlayerEntity();

    // registerEntity(heap, light);
    // registerEntity(heap, world);
    registerEntity(heap, card);
    // registerEntity(heap, player);

    // Systems
    // controlsSystem(heap);

    // gameTimeSystem(heap, ticker);
    // colliderSystem(heap, ticker);

    positionBodySystem(heap, ticker);

    cardSystem(heap, ticker);
    playerSystem(heap, ticker);
    enemySystem(heap, ticker);

    enemySpawnSystem(heap, ticker);

    // Render Systems
    meshesSystem(ticker, renderer.scene, heap);
    globalLightRenderSystem(heap, ticker);

    cardSurfaceSystem(ticker, renderer.scene, heap);
    cardReliefSystem(ticker, renderer.scene, heap);

    positionRenderSystem(heap, ticker);
    rotateRenderSystem(heap, ticker);
    atlasAnimationRenderSystem(heap, ticker);

    playerRenderSystem(heap, ticker);
    enemyRenderSystem(heap, ticker);

    healBarRenderSystem(heap, ticker);

    document.body.append(renderer.renderer.domElement);
}
