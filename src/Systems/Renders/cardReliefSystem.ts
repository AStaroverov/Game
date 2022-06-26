import { PlaneGeometry } from 'three';

import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { getMatrixCell, getMatrixSlice } from '../../Components/Matrix/Matrix';
import { ReliefMeshesMatrixID } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { isPassableTileType, TileType } from '../../Components/Matrix/TilesMatrix/def';
import { PositionComponentID } from '../../Components/Position';
import { $ref, HALF_RENDER_CARD_SIZE, RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { atlasTrees, CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { floor, round } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
import { tileYToPositionZ } from '../../utils/positionZ';
import { randomSign } from '../../utils/random';
import { mapVector, newVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const TREES_MUL = 1;
const TREES_COUNT = atlasTrees.list.length;
const RENDER_RADIUS = floor(HALF_RENDER_CARD_SIZE);

export function CardReliefSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const cardEntity = getEntities(heap, CardEntityID)[0];

    const playerPosition = getComponentStruct(playerEntity, PositionComponentID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const meshes = getComponentStruct(cardEntity, ReliefMeshesMatrixID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const abs = mapVector(sumVector(playerPosition, cardPosition), round);
        const uflooredPosition = mapVector(cardPosition, floor);

        Matrix.forEach(getMatrixSlice(cardTiles, abs.x, abs.y, RENDER_RADIUS), (tile, x, y) => {
            const cell = getMatrixCell(meshes, x, y);
            const mesh = cell?.[$ref];

            if (mesh === undefined) return;

            if (tile === undefined || isPassableTileType(tile.type)) {
                mesh.visible = false;
                return;
            }

            if (tile.type === TileType.wood) {
                const index =
                    x +
                    y * RENDER_CARD_SIZE -
                    (uflooredPosition.x + uflooredPosition.y * RENDER_CARD_SIZE);
                const meta = getMeta(index);
                const tree = atlasTrees.list[meta.index];
                const treeSize = newVector(tree.w * TREES_MUL, tree.h * TREES_MUL);

                mesh.visible = true;
                mesh.position.x += floor(meta.x * TILE_SIZE);
                mesh.position.y += floor(
                    (treeSize.y > TILE_SIZE ? tree.h / 2 : 0) + meta.y * TILE_SIZE,
                );
                mesh.position.z = tileYToPositionZ(y + x / RENDER_CARD_SIZE);

                if (mesh.material.map !== tree.texture) {
                    mesh.geometry = new PlaneGeometry(treeSize.x, treeSize.y);
                    mesh.material.map = tree.texture;
                    mesh.material.needsUpdate = true;
                }
            } else {
                mesh.visible = false;
            }
        });
    }
}

const tileIndexToMeta = new Map<number, { index: number; x: number; y: number }>();

function getMeta(n: number): { index: number; x: number; y: number } {
    if (!tileIndexToMeta.has(n)) {
        tileIndexToMeta.set(n, {
            index: Math.round(Math.random() * (TREES_COUNT - 1)),
            x: randomSign() * Math.random() * 0.05,
            y: Math.random() * 0.1,
        });
    }

    return tileIndexToMeta.get(n)!;
}
