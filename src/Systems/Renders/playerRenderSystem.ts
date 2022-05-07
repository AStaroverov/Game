import { Scene } from 'three';

import { getComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { CARD_SIZE, RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { atlasPlayer, isPlayerEntity } from '../../Entities/Player';
import { mapVector, sumVector, Vector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function playerRenderSystem(
    ticker: TasksScheduler,
    scene: Scene,
    heap: Heap,
): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionComponent);

    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const playerMesh = getComponent(playerEntity, MeshBasicComponent);
    const playerDirection = getComponent(playerEntity, DirectionComponent);
    const playerPosition = getComponent(playerEntity, PositionComponent);

    scene.add(playerMesh.mesh);

    animatePlayer(ticker, playerMesh, 60);

    ticker.addFrameInterval(tickRender, 1);

    function tickRender() {
        rotatePlayer(playerMesh, playerDirection);
        setPositionPlayerMesh(
            playerMesh,
            mapVector(
                sumVector(playerPosition, cardPosition),
                (v) => (v / (CARD_SIZE - 1)) * (RENDER_CARD_SIZE - 1),
            ),
        );
    }
}

function setPositionPlayerMesh(
    comp: MeshBasicComponent,
    position: Vector,
): void {
    comp.mesh.position.x = (position.x - 0.5) * TILE_SIZE;
    comp.mesh.position.y = (position.y - 0.5) * TILE_SIZE;
    comp.mesh.position.z = Math.floor(RENDER_CARD_SIZE / 4);
}

function rotatePlayer(
    meshComp: MeshBasicComponent,
    dirComp: DirectionComponent,
) {
    if (dirComp.x > 0) {
        meshComp.mesh.scale.x = 1;
    }
    if (dirComp.x < 0) {
        meshComp.mesh.scale.x = -1;
    }
}

function animatePlayer(
    ticker: TasksScheduler,
    component: MeshBasicComponent,
    duration: number,
): VoidFunction {
    let i = 0;
    const frames = atlasPlayer.list;
    const { material } = component.mesh;
    const frameDuration = duration / frames.length;
    const stop = ticker.addFrameInterval((delta) => {
        material.needsUpdate = true;
        material.map = frames[i].texture;
        i = Math.floor(i + delta / frameDuration) % frames.length;
    }, 10);

    material.map = frames[0].texture;

    return () => {
        stop();
        material.map = frames[0].texture;
    };
}
