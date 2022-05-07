import { BoxGeometry, Scene } from 'three';

import { getComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import {
    getMatrixCell,
    getMatrixSlice,
} from '../../Components/Matrix/MatrixComponent';
import { ReliefMeshesMatrixComponent } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import {
    TilesMatrixComponent,
    TileType,
} from '../../Components/Matrix/TilesMatrixComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { atlasTrees, isCardEntity } from '../../Entities/Card';
import { isPlayerEntity } from '../../Entities/Player';
import { floor, ufloor } from '../../utils/math';
import { getRandomSign } from '../../utils/random';
import {
    mapVector,
    newVector,
    roundVector,
    sumVector,
} from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const TREES_MUL = 2;
const TREES_COUNT = atlasTrees.list.length;
const RENDER_RADIUS = Math.floor(RENDER_CARD_SIZE / 2);

export function cardReliefSystem(
    ticker: TasksScheduler,
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
    ticker.addFrameInterval(tick, 1);

    const tileIndexToSalt = new Map<
        number,
        { index: number; x: number; y: number }
    >();

    function getSalt(n: number): { index: number; x: number; y: number } {
        if (!tileIndexToSalt.has(n)) {
            tileIndexToSalt.set(n, {
                index: Math.round(Math.random() * (TREES_COUNT - 1)),
                x: getRandomSign() * Math.random() * 0.05,
                y: Math.random() * 0.1,
            });
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
        const abs = roundVector(sumVector(playerPosition, cardPosition));
        const fractionPosition = newVector(
            -cardPosition.x % 1,
            -cardPosition.y % 1,
        );
        const uflooredPosition = mapVector(cardPosition, ufloor);

        getMatrixSlice(cardTiles, abs.x, abs.y, RENDER_RADIUS).forEach(
            (tile, x, y) => {
                const mesh = getMatrixCell(meshes, x, y);

                if (mesh === undefined) {
                    return;
                }

                if (tile === undefined || tile.type !== TileType.impassable) {
                    mesh.visible = false;
                    return;
                }

                const index =
                    x +
                    y * RENDER_CARD_SIZE -
                    (uflooredPosition.x +
                        uflooredPosition.y * RENDER_CARD_SIZE);
                const salt = getSalt(index);
                const tree = atlasTrees.list[salt.index];

                mesh.visible = true;
                mesh.position.x = floor(
                    (x - fractionPosition.x + salt.x) * TILE_SIZE,
                );
                mesh.position.y = floor(
                    (tree.h * TREES_MUL > TILE_SIZE ? tree.h / 2 : 0) +
                        (y - fractionPosition.y + salt.y) * TILE_SIZE,
                );

                if (mesh.material.map !== tree.texture) {
                    mesh.position.z = RENDER_CARD_SIZE - y - 1;
                    mesh.geometry = new BoxGeometry(
                        tree.w * TREES_MUL,
                        tree.h * TREES_MUL,
                        10,
                    );
                    mesh.material.map = tree.texture;
                    mesh.material.needsUpdate = true;
                }
            },
        );
    }
}
