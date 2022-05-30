import { GAME_VERSION } from '../CONST';
import { createGameHeap } from '../heap';
import { Renderer } from '../Renderer';
import { runActionSystem } from '../Systems/ActionSystem';
import { cardSystem } from '../Systems/cardSystem';
import { colliderSystem } from '../Systems/colliderSystem';
import { controlsSystem } from '../Systems/controlsSystem';
import { runDialogSystem } from '../Systems/DialogSystem';
import { EnemySpawnSystem } from '../Systems/enemySpawnSystem';
import { enemySystem } from '../Systems/enemySystem';
import { gameTimeSystem } from '../Systems/gameTimeSystem';
import { initCardSystem } from '../Systems/Init/initCardSystem';
import { initGameStorySystem } from '../Systems/Init/initGameStorySystem';
import { initLightSystem } from '../Systems/Init/initLightSystem';
import { initMatrixMeshesSystem } from '../Systems/Init/initMatrixMeshesSystem';
import { initMeshesSystem } from '../Systems/Init/initMeshesSystem';
import { initPlayerSystem } from '../Systems/Init/initPlayerSystem';
import { initWorldSystem } from '../Systems/Init/initWorldSystem';
import { NpcSpawnSystem } from '../Systems/NpcSpawnSystem';
import { playerSystem } from '../Systems/playerSystem';
import { positionBodySystem } from '../Systems/positionBodySystem';
import { atlasAnimationRenderSystem } from '../Systems/Renders/atlasAnimationRenderSystem';
import { cardReliefSystem } from '../Systems/Renders/cardReliefSystem';
import { cardSurfaceSystem } from '../Systems/Renders/cardSurfaceSystem';
import { runDialogRenderSystem } from '../Systems/Renders/DialogRenderSystem';
import { enemyRenderSystem } from '../Systems/Renders/enemyRenderSystem';
import { globalLightRenderSystem } from '../Systems/Renders/globalLightRenderSystem';
import { healBarRenderSystem } from '../Systems/Renders/healBarRenderSystem';
import { meshesSystem } from '../Systems/Renders/meshesSystem';
import { playerRenderSystem } from '../Systems/Renders/playerRenderSystem';
import { positionRenderSystem } from '../Systems/Renders/positionRenderSystem';
import { rotateRenderSystem } from '../Systems/Renders/rotateRenderSystem';
import { UnspawnSystem } from '../Systems/unspawnSystem';
import { saveSystem } from '../Systems/Utils/saveSystem';
import { tasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function game(): void {
    const saveString = localStorage.getItem(`SAVE_${GAME_VERSION}`);
    const saveObject = saveString ? JSON.parse(saveString) : undefined;

    const heap = createGameHeap(saveObject);
    const ticker = tasksScheduler;
    const renderer = new Renderer(ticker);

    // Utils
    saveSystem(heap);

    // Init Systems
    initWorldSystem(heap);
    initGameStorySystem(heap);
    initLightSystem(heap);
    initCardSystem(heap);
    initPlayerSystem(heap);
    initMeshesSystem(heap, ticker);
    initMatrixMeshesSystem(heap);

    // Systems
    controlsSystem(heap);
    runActionSystem(heap);

    gameTimeSystem(heap, ticker);
    colliderSystem(heap, ticker);

    positionBodySystem(heap, ticker);

    cardSystem(heap, ticker);
    playerSystem(heap, ticker);
    enemySystem(heap, ticker);

    EnemySpawnSystem(heap, ticker);
    NpcSpawnSystem(heap, ticker);
    UnspawnSystem(heap, ticker);

    // Render Systems
    globalLightRenderSystem(heap, ticker);
    meshesSystem(heap, ticker, renderer.scenes);

    cardSurfaceSystem(heap, ticker);
    cardReliefSystem(heap, ticker);

    positionRenderSystem(heap, ticker);
    rotateRenderSystem(heap, ticker);
    atlasAnimationRenderSystem(heap, ticker);

    playerRenderSystem(heap, ticker);
    enemyRenderSystem(heap, ticker);

    healBarRenderSystem(heap, ticker);

    // DIALOG
    runDialogSystem(heap, ticker);
    runDialogRenderSystem(heap, ticker);

    document.body.append(renderer.renderers['Main'].domElement);
    document.body.append(renderer.renderers['Fixed'].domElement);
    styleCanvases();
}

function styleCanvases() {
    const style = document.createElement('style');

    // language=CSS
    style.textContent = `
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    `;

    document.head.appendChild(style);
}
