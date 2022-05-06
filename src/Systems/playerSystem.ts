import { Scene } from 'three';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { DirectionComponent } from '../Components/DirectionComponent';
import { MeshBasicComponent } from '../Components/MeshBasicComponent';
import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { atlasPlayer, isPlayerEntity } from '../Entities/Player';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function playerSystem(
    ticker: FrameTasks,
    scene: Scene,
    heap: Heap,
): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const playerMesh = getComponent(playerEntity, MeshBasicComponent);
    const playerDirection = getComponent(playerEntity, DirectionComponent);

    scene.add(playerMesh.mesh);

    movePlayer(
        playerMesh,
        Math.floor(RENDER_CARD_SIZE / 2) * TILE_SIZE,
        Math.floor(RENDER_CARD_SIZE / 2) * TILE_SIZE,
    );

    rotatePlayer(ticker, playerMesh, playerDirection);
    animatePlayer(ticker, playerMesh, 60);
}

function movePlayer(comp: MeshBasicComponent, x: number, y: number): void {
    comp.mesh.position.x = x;
    comp.mesh.position.y = y;
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
    const frames = atlasPlayer.frames;
    const { material } = component.mesh;
    const frameDuration = duration / frames.length;
    const stop = ticker.addInterval((delta) => {
        material.setValues({ map: frames[i].texture });
        i = Math.floor(i + delta / frameDuration) % frames.length;
    }, 10);

    material.setValues({ map: frames[0].texture });

    return () => {
        stop();
        material.map = frames[0].texture;
    };
}
