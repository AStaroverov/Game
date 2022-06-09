import { PlaneGeometry } from 'three';

import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { getMatrixCell, getMatrixSlice } from '../../Components/Matrix/Matrix';
import { ReliefMeshesMatrixID } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { TileType } from '../../Components/Matrix/TilesMatrix/def';
import { PositionComponentID } from '../../Components/Position';
import { $ref, RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { atlasTrees, CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { floor, round, ufloor } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
import { tileYToPositionZ } from '../../utils/positionZ';
import { randomSign } from '../../utils/random';
import { mapVector, newVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const TREES_MUL = 2;
const TREES_COUNT = atlasTrees.list.length;
const RENDER_RADIUS = Math.floor(RENDER_CARD_SIZE / 2);

export function cardReliefSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const cardEntity = getEntities(heap, CardEntityID)[0];

    const playerPosition = getComponentStruct(
        playerEntity,
        PositionComponentID,
    );
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const meshes = getComponentStruct(cardEntity, ReliefMeshesMatrixID);

    ticker.addFrameInterval(tick, 1);

    const tileIndexToSalt = new Map<
        number,
        { index: number; x: number; y: number }
    >();

    function getSalt(n: number): { index: number; x: number; y: number } {
        if (!tileIndexToSalt.has(n)) {
            tileIndexToSalt.set(n, {
                index: Math.round(Math.random() * (TREES_COUNT - 1)),
                x: randomSign() * Math.random() * 0.05,
                y: Math.random() * 0.1,
            });
        }

        return tileIndexToSalt.get(n)!;
    }

    function tick() {
        const abs = mapVector(sumVector(playerPosition, cardPosition), round);
        const fractionPosition = newVector(
            -cardPosition.x % 1,
            -cardPosition.y % 1,
        );
        const uflooredPosition = mapVector(cardPosition, ufloor);

        Matrix.forEach(
            getMatrixSlice(cardTiles, abs.x, abs.y, RENDER_RADIUS),
            (tile, x, y) => {
                const cell = getMatrixCell(meshes, x, y);
                const mesh = cell?.[$ref];

                if (mesh === undefined) {
                    return;
                }

                if (
                    tile === undefined ||
                    tile.type === TileType.empty ||
                    tile.passable === true
                ) {
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
                const treeSize = newVector(
                    tree.w * TREES_MUL,
                    tree.h * TREES_MUL,
                );

                mesh.visible = true;
                mesh.position.x = floor(
                    (x - fractionPosition.x + salt.x) * TILE_SIZE,
                );
                mesh.position.y = floor(
                    (treeSize.y > TILE_SIZE ? tree.h / 2 : 0) +
                        (y - fractionPosition.y + salt.y) * TILE_SIZE,
                );
                mesh.position.z = tileYToPositionZ(y + x / RENDER_CARD_SIZE);

                if (mesh.material.map !== tree.texture) {
                    mesh.geometry = new PlaneGeometry(treeSize.x, treeSize.y);
                    mesh.material.map = tree.texture;
                    mesh.material.needsUpdate = true;
                }
            },
        );
    }
}
