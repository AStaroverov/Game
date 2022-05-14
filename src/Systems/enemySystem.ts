import memoize from 'memoizee';
import { BiAStarFinder, DiagonalMovement, Grid } from 'pathfinding';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import Enumerable from '../../lib/linq';
import { DirectionComponent } from '../Components/DirectionComponent';
import {
    Tile,
    TilesMatrixConstructor,
    TileType,
} from '../Components/Matrix/TilesMatrix';
import { PositionConstructor } from '../Components/Position';
import { setVelocity, VelocityConstructor } from '../Components/Velocity';
import { isCardEntity } from '../Entities/Card';
import { EnemyEntity, isEnemyEntity } from '../Entities/Enemy';
import { isPlayerEntity } from '../Entities/Player';
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

export function enemySystem(heap: Heap, ticker: TasksScheduler): void {
    const card = [...heap.getEntities(isCardEntity)][0];
    const cardTiles = getComponent(card, TilesMatrixConstructor);
    const cardPosition = getComponent(card, PositionConstructor);

    const player = [...heap.getEntities(isPlayerEntity)][0];
    const playerPosition = getComponent(player, PositionConstructor);

    const pathFinder = new BiAStarFinder({
        diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
    });

    ticker.addFrameInterval(tick, 1);

    function tick() {
        Enumerable.from(heap.getEntities(isEnemyEntity)).forEach(
            setEnemyDirection,
        );
    }

    function setEnemyDirection(enemy: EnemyEntity) {
        const position = getComponent(enemy, PositionConstructor);
        const direction = getComponent(enemy, DirectionComponent);
        const velocity = getComponent(enemy, VelocityConstructor);

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
        (_: PositionConstructor) => matrixToNestedArray(cardTiles.matrix),
        {
            max: 100,
            normalizer: ([p]: [PositionConstructor]) => stringVector(p),
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
