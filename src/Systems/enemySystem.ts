import memoize from 'memoizee';
import { BiAStarFinder, DiagonalMovement, Grid } from 'pathfinding';

import { getComponentBody } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import {
    Tile,
    TilesMatrixID,
    TileType,
} from '../Components/Matrix/TilesMatrix';
import { PositionComponentID } from '../Components/Position';
import { setVelocity, VelocityComponentID } from '../Components/Velocity';
import { CardEntityID } from '../Entities/Card';
import { EnemyEntity, EnemyEntityID } from '../Entities/Enemy';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { floor, ufloor } from '../utils/math';
import { Matrix } from '../utils/Matrix';
import {
    isEqualVectors,
    mapVector,
    negateVector,
    newVector,
    setVector,
    stringVector,
    sumVector,
    Vector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';
import { isInsideCard } from '../utils/tiles';

export function enemySystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentBody(cardEntity, TilesMatrixID);
    const cardPosition = getComponentBody(cardEntity, PositionComponentID);

    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentBody(playerEntity, PositionComponentID);

    const pathFinder = new BiAStarFinder({
        diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
    });

    ticker.addFrameInterval(tick, 1);

    function tick() {
        getEntities(heap, EnemyEntityID).forEach(setEnemyDirection);
    }

    function setEnemyDirection(enemy: EnemyEntity) {
        const position = getComponentBody(enemy, PositionComponentID);
        const direction = getComponentBody(enemy, DirectionComponentID);
        const velocity = getComponentBody(enemy, VelocityComponentID);

        const cardTilePosition = mapVector(cardPosition, ufloor);
        const enemyTilePosition = sumVector(
            mapVector(position, floor),
            cardTilePosition,
        );
        const playerTilePosition = sumVector(
            mapVector(playerPosition, floor),
            cardTilePosition,
        );

        if (!isInsideCard(enemyTilePosition)) {
            return;
        }

        if (isEqualVectors(enemyTilePosition, playerTilePosition)) {
            return setVelocity(velocity, 0);
        }

        const path = findPath(
            enemyTilePosition,
            playerTilePosition,
            cardTilePosition,
        );

        if (path.length > 1) {
            const nextTilePosition = newVector(path[1][0], path[1][1]);
            const nextDirection = sumVector(
                nextTilePosition,
                negateVector(enemyTilePosition),
            );

            setVector(direction, nextDirection);
            setVelocity(velocity, 0.05);
        }
    }

    const findPath = memoize(
        (from: Vector, to: Vector, card: Vector) => {
            return pathFinder.findPath(
                from.x,
                from.y,
                to.x,
                to.y,
                new Grid(getMatrix(card)),
            );
        },
        {
            max: 100,
            normalizer: ([from, to, card]) =>
                `${stringVector(from)}${stringVector(to)}${stringVector(card)}`,
        },
    );

    const getMatrix = memoize(
        (_: Vector) => matrixToNestedArray(cardTiles.matrix),
        {
            max: 100,
            normalizer: ([p]: [Vector]) => stringVector(p),
        },
    );
}

function matrixToNestedArray<T extends Tile>(matrix: Matrix<T>): number[][] {
    const m = new Array(matrix.h)
        .fill(null)
        .map(() => new Array(matrix.w).fill(null));

    matrix.forEach((v, x, y) => {
        m[y][x] = v.type === TileType.passable ? 0 : 1;
    });

    return m;
}
