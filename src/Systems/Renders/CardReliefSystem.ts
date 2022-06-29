import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { atlases, AtlasName } from '../../Components/AtlasAnimation/atlases';
import { getMatrixCell, getMatrixSlice } from '../../Components/Matrix/Matrix';
import { ReliefMeshesMatrixID } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { isPassableTileType, TileType } from '../../Components/Matrix/TilesMatrix/def';
import { PositionComponentID } from '../../Components/Position';
import { $ref, HALF_RENDER_CARD_SIZE, RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { floor, round } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
import { worldPositionToZIndex } from '../../utils/positionZ';
import { random, randomArbitraryFloat, randomSign } from '../../utils/random';
import { mapVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const TREES_MUL = 1;
const TREES_FRAMES = atlases[AtlasName.Tree].list;
const TREES_COUNT = TREES_FRAMES.length;
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
                const tree = TREES_FRAMES[meta.index];

                mesh.visible = true;
                mesh.position.x = (mesh.position.x + floor(meta.x * TILE_SIZE)) | 0;
                mesh.position.y = (mesh.position.y - floor(tree.h * 0.4 + meta.y * TILE_SIZE)) | 0;
                mesh.zIndex = worldPositionToZIndex(mesh.position);

                if (mesh.texture !== tree.texture) {
                    mesh.texture = tree.texture;
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
            index: round(random() * (TREES_COUNT - 1)),
            x: randomSign() * randomArbitraryFloat(0, 0.2),
            y: randomSign() * randomArbitraryFloat(0, 0.2),
        });
    }

    return tileIndexToMeta.get(n)!;
}
