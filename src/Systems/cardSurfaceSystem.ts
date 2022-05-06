import { Scene, TextureLoader } from 'three';

import imageGrass from '../../assets/sprites/tilesets/grass.png';
import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import {
    getMatrixCell,
    getMatrixSlice,
} from '../Components/Matrix/MatrixComponent';
import { SurfaceMeshesMatrixComponent } from '../Components/Matrix/SurfaceMeshesMatrixComponent';
import {
    tilesFillEmpty,
    tilesInit,
    TilesMatrixComponent,
} from '../Components/Matrix/TilesMatrixComponent';
import { PositionComponent } from '../Components/PositionComponent';
import { CARD_SIZE, RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { isCardEntity } from '../Entities/Card';
import { isPlayerEntity } from '../Entities/Player';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

const textureGrass = new TextureLoader().load(imageGrass);

export function cardSurfaceSystem(
    ticker: FrameTasks,
    scene: Scene,
    heap: Heap,
): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const cardEntity = [...heap.getEntities(isCardEntity)][0];

    const playerPosition = getComponent(playerEntity, PositionComponent);
    const cardPosition = getComponent(cardEntity, PositionComponent);
    const cardTiles = getComponent(cardEntity, TilesMatrixComponent);
    const cardMeshes = getComponent(cardEntity, SurfaceMeshesMatrixComponent);

    const sx = Math.floor(CARD_SIZE / 2);
    const sy = Math.floor(CARD_SIZE / 2);

    tilesInit(cardTiles, sx, sy);
    tilesFillEmpty(cardTiles);

    addToScene();
    ticker.addInterval(tick, 1);

    function addToScene() {
        cardMeshes.matrix.forEach((mesh) => {
            scene.add(mesh);
        });
    }

    function updateSurface() {
        getMatrixSlice(
            cardTiles,
            playerPosition.x + cardPosition.x,
            playerPosition.y + cardPosition.y,
            Math.floor(RENDER_CARD_SIZE / 2),
        ).forEach((tile, x, y) => {
            const mesh = getMatrixCell(cardMeshes, x, y);

            if (tile && mesh) {
                mesh.visible = true;
                mesh.position.x = x * TILE_SIZE;
                mesh.position.y = y * TILE_SIZE;
                mesh.material.map = textureGrass;
                mesh.material.needsUpdate = true;
            } else if (mesh) {
                mesh.visible = false;
            }
        });
    }

    function tick() {
        updateSurface();
    }
}
