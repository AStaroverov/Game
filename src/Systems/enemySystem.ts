import memoize from 'memoizee';
import { BiAStarFinder, DiagonalMovement, Grid } from 'pathfinding';

import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import { TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { isPassableTileType, Tile } from '../Components/Matrix/TilesMatrix/def';
import { PositionComponentID } from '../Components/Position';
import { setVelocity, VelocityComponentID } from '../Components/Velocity';
import { CardEntityID } from '../Entities/Card';
import { EnemyEntity, EnemyEntityID } from '../Entities/Enemy';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { floor, ufloor } from '../utils/math';
import { Matrix, TMatrix } from '../utils/Matrix';
import {
    isEqualVectors,
    mapVector,
    negateVector,
    newVector,
    setVector,
    sumVector,
    toStringVector,
    TVector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';
import { isInsideCard } from '../utils/tiles';

export function enemySystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(playerEntity, PositionComponentID);

    const pathFinder = new BiAStarFinder({
        diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
    });

    ticker.addFrameInterval(tick, 3);

    function tick() {
        getEntities(heap, EnemyEntityID).forEach(setEnemyDirection);
    }

    function setEnemyDirection(enemy: EnemyEntity) {
        const position = getComponentStruct(enemy, PositionComponentID);
        const direction = getComponentStruct(enemy, DirectionComponentID);
        const velocity = getComponentStruct(enemy, VelocityComponentID);

        const cardTilePosition = mapVector(cardPosition, ufloor);
        const enemyTilePosition = sumVector(mapVector(position, floor), cardTilePosition);
        const playerTilePosition = sumVector(mapVector(playerPosition, floor), cardTilePosition);

        if (!isInsideCard(enemyTilePosition)) {
            return;
        }

        if (isEqualVectors(enemyTilePosition, playerTilePosition)) {
            return setVelocity(velocity, 0);
        }

        const path = findPath(enemyTilePosition, playerTilePosition, cardTilePosition);

        if (path.length > 1) {
            const nextTilePosition = newVector(path[1][0], path[1][1]);
            const nextDirection = sumVector(nextTilePosition, negateVector(enemyTilePosition));

            setVector(direction, nextDirection);
            setVelocity(velocity, 0.003);
        }
    }

    // We should memoize it on some short time
    const findPath = memoize(
        (from: TVector, to: TVector, card: TVector) => {
            return pathFinder.findPath(from.x, from.y, to.x, to.y, new Grid(getMatrix(card)));
        },
        {
            max: 100,
            normalizer: ([from, to, card]) =>
                `${toStringVector(from)}${toStringVector(to)}${toStringVector(card)}`,
        },
    );

    // We should memoize it on some short time
    const getMatrix = memoize((_: TVector) => matrixToNestedArray(cardTiles.matrix), {
        max: 100,
        normalizer: ([p]: [TVector]) => toStringVector(p),
    });
}

function matrixToNestedArray<T extends Tile>(matrix: TMatrix<T>): number[][] {
    const m = new Array(matrix.h).fill(null).map(() => new Array(matrix.w).fill(null));

    Matrix.forEach(matrix, (v, x, y) => {
        m[y][x] = isPassableTileType(v.type) ? 0 : 1;
    });

    return m;
}
