import { GAME_VERSION } from '../CONST';
import { createGameHeap } from '../heap';
import { Renderer } from '../Renderer';
import { ActionSystem } from '../Systems/ActionSystem';
import { RunCardSystem } from '../Systems/CardSystem';
import { colliderSystem } from '../Systems/colliderSystem';
import { ControlsSystem } from '../Systems/controlsSystem';
import { DialogSystem } from '../Systems/DialogSystem';
import { GameTimeSystem } from '../Systems/gameTimeSystem';
import { initCardSystem } from '../Systems/Init/initCardSystem';
import { InitLightSystem } from '../Systems/Init/initLightSystem';
import { initMatrixMeshesSystem } from '../Systems/Init/initMatrixMeshesSystem';
import { initMeshesSystem } from '../Systems/Init/initMeshesSystem';
import { initPlayerSystem } from '../Systems/Init/initPlayerSystem';
import { initSettingsSystem } from '../Systems/Init/initSettingsSystem';
import { initWorldSystem } from '../Systems/Init/initWorldSystem';
import { NpcSpawnSystem } from '../Systems/NpcSpawnSystem';
import { positionBodySystem } from '../Systems/positionBodySystem';
import { AtlasAnimationRenderSystem } from '../Systems/Renders/atlasAnimationRenderSystem';
import { CardMeshPositionSystem } from '../Systems/Renders/cardMeshPositionSystem';
import { CardReliefSystem } from '../Systems/Renders/cardReliefSystem';
import { CardSurfaceSystem } from '../Systems/Renders/cardSurfaceSystem';
import { DialogRenderSystem } from '../Systems/Renders/DialogRenderSystem';
import { GlobalLightRenderSystem } from '../Systems/Renders/globalLightRenderSystem';
import { HouseRenderSystem } from '../Systems/Renders/HouseRenderSystem';
import { MeshesPositionSystem } from '../Systems/Renders/MeshesPositionSystem';
import { MeshesResetSystem } from '../Systems/Renders/MeshesResetSystem';
import { PlayerRenderSystem } from '../Systems/Renders/playerRenderSystem';
import { RenderSystem } from '../Systems/Renders/RenderSystem';
import { RotateRenderSystem } from '../Systems/Renders/rotateRenderSystem';
import { UnspawnSystem } from '../Systems/unspawnSystem';
import { saveSystem } from '../Systems/Utils/saveSystem';
import { VillageSpawnSystem } from '../Systems/VillageSpawnSystem';
import { tasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function game(): void {
    const saveString = localStorage.getItem(`SAVE_${GAME_VERSION}`);
    const saveObject = saveString ? JSON.parse(saveString) : undefined;

    const heap = createGameHeap(saveObject);
    const ticker = tasksScheduler;
    const renderer = new Renderer();

    // Utils
    saveSystem(heap);

    // Init Systems
    initSettingsSystem(heap);
    initWorldSystem(heap);
    InitLightSystem(heap);
    initCardSystem(heap);
    initPlayerSystem(heap);
    initMeshesSystem(heap, ticker);
    initMatrixMeshesSystem(heap);

    // Systems
    ControlsSystem(heap, ticker);
    ActionSystem(heap);

    GameTimeSystem(heap, ticker);
    colliderSystem(heap, ticker);

    positionBodySystem(heap, ticker);

    RunCardSystem(heap, ticker);
    // playerSystem(heap, ticker);
    // enemySystem(heap, ticker);

    VillageSpawnSystem(heap, ticker);
    // EnemySpawnSystem(heap, ticker);
    NpcSpawnSystem(heap, ticker);
    UnspawnSystem(heap, ticker);

    // Render Systems
    GlobalLightRenderSystem(heap, ticker);
    MeshesResetSystem(heap, ticker, renderer.scenes);
    RenderSystem(ticker, renderer);

    CardMeshPositionSystem(heap, ticker);
    CardSurfaceSystem(heap, ticker);
    CardReliefSystem(heap, ticker);

    MeshesPositionSystem(heap, ticker);
    RotateRenderSystem(heap, ticker);
    AtlasAnimationRenderSystem(heap, ticker);

    PlayerRenderSystem(heap, ticker);
    HouseRenderSystem(heap, ticker);

    // healBarRenderSystem(heap, ticker);

    // DIALOG
    DialogSystem(heap, ticker);
    DialogRenderSystem(heap, ticker);

    document.body.append(renderer.renderers['Main'].view);
    document.body.append(renderer.renderers['Fixed'].view);
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
