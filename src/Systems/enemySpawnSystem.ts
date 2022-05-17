import { getComponentStruct } from '../../lib/ECS/Entity';
import {
    getEntities,
    registerEntity,
    unregisterEntity,
} from '../../lib/ECS/Heap';
import Enumerable from '../../lib/linq';
import {
    Tile,
    TilesMatrixID,
    TileType,
} from '../Components/Matrix/TilesMatrix';
import { PositionComponentID } from '../Components/Position';
import { CENTER_CARD_POSITION, HALF_CARD_SIZE } from '../CONST';
import { CardEntityID } from '../Entities/Card';
import {
    createEnemyEntity,
    EnemyEntity,
    EnemyEntityID,
} from '../Entities/Enemy';
import { GameHeap } from '../heap';
import { abs, floor } from '../utils/math';
import { Item, radialForEach } from '../utils/Matrix/utils';
import { random } from '../utils/random';
import { mulVector, newVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function enemySpawnSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    ticker.addTimeInterval(tick, 1000);

    function tick() {
        const enemies = getEntities(heap, EnemyEntityID);

        clear(enemies);
        if (enemies.length < 1) {
            spawn();
        }
    }

    function clear(enemies: EnemyEntity[]) {
        enemies.forEach((enemy) => {
            const position = getComponentStruct(enemy, PositionComponentID);
            const diff = sumVector(
                position,
                mulVector(CENTER_CARD_POSITION, -1),
                cardPosition,
            );

            if (abs(diff.x) > HALF_CARD_SIZE || abs(diff.y) > HALF_CARD_SIZE) {
                unregisterEntity(heap, enemy);
            }
        });
    }

    function spawn() {
        const enemy = createEnemyEntity();
        const start = newVector(
            floor(cardTiles.matrix.w / 2), // Start must be relative to user
            floor(cardTiles.matrix.h / 2),
        );
        const suitableItem = Enumerable.from(
            radialForEach(cardTiles.matrix, start.x, start.y),
        )
            .where((tile): tile is Item<Tile> => tile !== undefined)
            .first(({ x, y, value }) => {
                const dist = abs(start.x + start.y - (x + y));

                return (
                    value.type === TileType.passable &&
                    dist > 10 &&
                    random() > 0.9
                );
            });

        if (suitableItem) {
            const position = getComponentStruct(enemy, PositionComponentID);
            const seedPosition = sumVector(
                suitableItem,
                mulVector(cardPosition, -1),
            );

            setVector(position, seedPosition);

            registerEntity(heap, enemy);
        } else {
            debugger;
        }
    }
}
