import { BoxGeometry, Scene } from 'three';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import {
    getMatrixCell,
    getMatrixSlice,
} from '../Components/Matrix/MatrixComponent';
import { ReliefMeshesMatrixComponent } from '../Components/Matrix/ReliefMeshesMatrixComponent';
import {
    TilesMatrixComponent,
    TileType,
} from '../Components/Matrix/TilesMatrixComponent';
import { PositionComponent } from '../Components/PositionComponent';
import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { atlasTrees, isCardEntity } from '../Entities/Card';
import { isPlayerEntity } from '../Entities/Player';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function cardReliefSystem(
    ticker: FrameTasks,
    scene: Scene,
    heap: Heap,
): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const cardEntity = [...heap.getEntities(isCardEntity)][0];

    const playerPosition = getComponent(playerEntity, PositionComponent);
    const cardPosition = getComponent(cardEntity, PositionComponent);
    const cardTiles = getComponent(cardEntity, TilesMatrixComponent);
    const meshes = getComponent(cardEntity, ReliefMeshesMatrixComponent);

    addToScene();
    hideMeshes();
    ticker.addInterval(tick, 1);

    const tileIndexToSalt = new Map<number, number>();

    function getSalt(n: number, l: number): number {
        if (!tileIndexToSalt.has(n)) {
            tileIndexToSalt.set(n, Math.round(Math.random() * l));
        }

        return tileIndexToSalt.get(n)!;
    }

    function addToScene() {
        meshes.matrix.forEach((mesh) => {
            scene.add(mesh);
        });
    }

    function hideMeshes() {
        meshes.matrix.forEach((mesh) => {
            mesh.visible = false;
        });
    }

    function tick() {
        const absX = playerPosition.x + cardPosition.x;
        const absY = playerPosition.y + cardPosition.y;
        const r = Math.floor(RENDER_CARD_SIZE / 2);

        getMatrixSlice(cardTiles, absX, absY, r).forEach((tile, x, y) => {
            const mesh = getMatrixCell(meshes, x, y);

            if (mesh === undefined) {
                return;
            }

            if (tile === undefined || tile.type !== TileType.impassable) {
                mesh.visible = false;
                return;
            }

            mesh.visible = true;
            mesh.position.x = x * TILE_SIZE;
            mesh.position.y = y * TILE_SIZE;
            mesh.position.z = RENDER_CARD_SIZE - y - 1;

            const length = atlasTrees.list.length;
            const index =
                x +
                y * RENDER_CARD_SIZE -
                (cardPosition.x + cardPosition.y * RENDER_CARD_SIZE);
            const tree = atlasTrees.list[getSalt(index, length - 1)];

            if (mesh.material.map !== tree.texture) {
                mesh.geometry = new BoxGeometry(tree.w * 2, tree.h * 2, 10);
                mesh.material.map = tree.texture;
                mesh.material.needsUpdate = true;
            }
        });
    }
}
