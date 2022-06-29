import { DisplayObject } from '@pixi/display';

import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { getMatrixSlice } from '../../Components/Matrix/Matrix';
import { ReliefMeshesMatrixID } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { SurfaceMeshesMatrixID } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { PositionComponentID } from '../../Components/Position';
import { $ref, HALF_RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { floor, round } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
import { mapVector, newVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const RENDER_RADIUS = floor(HALF_RENDER_CARD_SIZE);

export function CardMeshPositionSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const cardEntity = getEntities(heap, CardEntityID)[0];

    const playerPosition = getComponentStruct(playerEntity, PositionComponentID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const surfaceMatrix = getComponentStruct(cardEntity, SurfaceMeshesMatrixID);
    const reliefMatrix = getComponentStruct(cardEntity, ReliefMeshesMatrixID);
    const matrices = [surfaceMatrix, reliefMatrix];

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const abs = mapVector(sumVector(playerPosition, cardPosition), round);
        const fractionPosition = newVector(
            (cardPosition.x > 0 ? 1 : 0) - (cardPosition.x % 1),
            (cardPosition.y > 0 ? 1 : 0) - (cardPosition.y % 1),
        );

        Matrix.forEach(getMatrixSlice(cardTiles, abs.x, abs.y, RENDER_RADIUS), (tile, x, y) => {
            matrices.forEach(({ matrix }) =>
                setPosition(
                    Matrix.get(matrix, x, y)?.[$ref],
                    tile !== undefined,
                    floor((x - fractionPosition.x) * TILE_SIZE),
                    floor((y - fractionPosition.y) * TILE_SIZE),
                ),
            );
        });
    }
}
function setPosition(
    mesh: undefined | DisplayObject,
    visible: boolean,
    x: number,
    y: number,
): void {
    if (mesh === undefined) return;

    mesh.visible = visible;
    mesh.position.x = x | 0;
    mesh.position.y = y | 0;
}
