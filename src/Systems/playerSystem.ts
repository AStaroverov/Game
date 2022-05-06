import { Scene } from 'three';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { DirectionComponent } from '../Components/DirectionComponent';
import { MeshBasicComponent } from '../Components/MeshBasicComponent';
import { PositionComponent } from '../Components/PositionComponent';
import { CARD_SIZE, RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { atlasPlayer, isPlayerEntity } from '../Entities/Player';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function playerSystem(
    ticker: FrameTasks,
    scene: Scene,
    heap: Heap,
): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const playerMesh = getComponent(playerEntity, MeshBasicComponent);
    const playerPosition = getComponent(playerEntity, PositionComponent);
    const playerDirection = getComponent(playerEntity, DirectionComponent);

    const centerIndex = Math.floor(CARD_SIZE / 2);
    const centerRenderIndex = Math.floor(RENDER_CARD_SIZE / 2);

    scene.add(playerMesh.mesh);

    movePlayer(playerPosition, centerIndex, centerIndex);
    rotatePlayer(ticker, playerMesh, playerDirection);
    animatePlayer(ticker, playerMesh, 60);

    ticker.addInterval(tick, 1);

    function tick() {
        movePlayerMesh(
            playerMesh,
            centerRenderIndex * TILE_SIZE,
            centerRenderIndex * TILE_SIZE,
            centerRenderIndex / 2,
        );
    }
}

function movePlayer(comp: PositionComponent, x: number, y: number): void {
    comp.x = x;
    comp.y = y;
}

function movePlayerMesh(
    comp: MeshBasicComponent,
    x: number,
    y: number,
    z: number,
): void {
    comp.mesh.position.x = x;
    comp.mesh.position.y = y;
    comp.mesh.position.z = z;
}

function rotatePlayer(
    ticker: FrameTasks,
    meshComp: MeshBasicComponent,
    dirComp: DirectionComponent,
) {
    return ticker.addInterval(() => {
        if (dirComp.x === 1) {
            meshComp.mesh.scale.x = 1;
        }
        if (dirComp.x === -1) {
            meshComp.mesh.scale.x = -1;
        }
    }, 1);
}

function animatePlayer(
    ticker: FrameTasks,
    component: MeshBasicComponent,
    duration: number,
): VoidFunction {
    let i = 0;
    const frames = atlasPlayer.list;
    const { material } = component.mesh;
    const frameDuration = duration / frames.length;
    const stop = ticker.addInterval((delta) => {
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
