import memoize from 'memoizee';
import { AStarFinder, Grid } from 'pathfinding';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import Enumerable from '../../lib/linq';
import { DirectionComponent } from '../Components/DirectionComponent';
import {
    TilesMatrixComponent,
    TileType,
} from '../Components/Matrix/TilesMatrixComponent';
import { PositionComponent } from '../Components/PositionComponent';
import {
    setVelocity,
    VelocityComponent,
} from '../Components/VelocityComponent';
import { isCardEntity } from '../Entities/Card';
import { EnemyEntity, isEnemyEntity } from '../Entities/Enemy';
import { isPlayerEntity } from '../Entities/Player';
import { ceil, floor } from '../utils/math';
import {
    isEqualVectors,
    mapVector,
    negateVector,
    newVector,
    setVector,
    sumVector,
    Vector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';
import { isInsideCard } from '../utils/tiles';

export function enemySystem(heap: Heap, ticker: TasksScheduler): void {
    const card = [...heap.getEntities(isCardEntity)][0];
    const cardTiles = getComponent(card, TilesMatrixComponent);
    const cardPosition = getComponent(card, PositionComponent);

    const player = [...heap.getEntities(isPlayerEntity)][0];
    const playerPosition = getComponent(player, PositionComponent);

    const pathFinder = new AStarFinder();

    ticker.addFrameInterval(tick, 1);

    function tick() {
        Enumerable.from(heap.getEntities(isEnemyEntity)).forEach(
            setEnemyDirection,
        );
    }

    function setEnemyDirection(enemy: EnemyEntity) {
        const position = getComponent(enemy, PositionComponent);
        const direction = getComponent(enemy, DirectionComponent);
        const velocity = getComponent(enemy, VelocityComponent);

        const cardTilePosition = mapVector(cardPosition, ceil);
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
            setVelocity(velocity, 0.08);
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
                `${from.x}|${from.y}|${to.x}|${to.y}|${card.x}|${card.y}`,
        },
    );

    const getMatrix = memoize(
        (_: PositionComponent) => {
            return cardTiles.matrix
                .toNestedArray()
                .map((arr) =>
                    arr.map((v) => (v.type === TileType.passable ? 0 : 1)),
                );
        },
        {
            max: 1,
            normalizer: ([p]: [PositionComponent]) => `${p.x}|${p.y}`,
        },
    );
}
