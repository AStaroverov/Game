import { addEntity } from '../../lib/ECS/Heap';
import { CARD_SIZE, GAME_VERSION, RENDER_CARD_SIZE } from '../CONST';
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
import { initCardSystem } from '../Systems/Init/initCardSystem';
import { initLightSystem } from '../Systems/Init/initLightSystem';
import { initMatrixMeshesSystem } from '../Systems/Init/initMatrixMeshesSystem';
import { initMeshesSystem } from '../Systems/Init/initMeshesSystem';
import { initPlayerSystem } from '../Systems/Init/initPlayerSystem';
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
import { saveSystem } from '../Systems/Utils/saveSystem';
import { newSize } from '../utils/shape';
import { tasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function game(): void {
    const saveString = localStorage.getItem(`SAVE_${GAME_VERSION}`);
    const saveObject = saveString ? JSON.parse(saveString) : undefined;

    const heap = createGameHeap(saveObject);
    const ticker = tasksScheduler;
    const renderer = new Renderer(ticker);

    // Entities
    if (saveObject === undefined) {
        const light = createGlobalLightEntity();
        const world = createWorldEntity();
        const card = createCardEntity({
            tileSize: newSize(CARD_SIZE),
            meshSize: newSize(RENDER_CARD_SIZE),
        });
        const player = createPlayerEntity();

        addEntity(heap, light);
        addEntity(heap, world);
        addEntity(heap, card);
        addEntity(heap, player);
    }

    // Utils
    saveSystem(heap);

    // Init Systems
    initLightSystem(heap);
    initCardSystem(heap);
    initPlayerSystem(heap);
    initMeshesSystem(heap, ticker);
    initMatrixMeshesSystem(heap);

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
