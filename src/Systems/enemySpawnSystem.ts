import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import Enumerable from '../../lib/linq';
import {
    Tile,
    TilesMatrixConstructor,
    TileType,
} from '../Components/Matrix/TilesMatrix';
import { PositionConstructor } from '../Components/Position';
import { CENTER_CARD_POSITION, HALF_CARD_SIZE } from '../CONST';
import { isCardEntity } from '../Entities/Card';
import { EnemyEntity, isEnemyEntity } from '../Entities/Enemy';
import { abs, floor } from '../utils/math';
import { Item, radialForEach } from '../utils/Matrix/utils';
import { random } from '../utils/random';
import { mulVector, newVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function enemySpawnSystem(heap: Heap, ticker: TasksScheduler): void {
    const card = [...heap.getEntities(isCardEntity)][0];
    const cardTiles = getComponent(card, TilesMatrixConstructor);
    const cardPosition = getComponent(card, PositionConstructor);

    ticker.addTimeInterval(tick, 1000);

    function tick() {
        const enemies = [...heap.getEntities(isEnemyEntity)];

        clear(enemies);
        if (enemies.length < 1) {
            spawn();
        }
    }

    function clear(enemies: EnemyEntity[]) {
        enemies.forEach((enemy) => {
            const position = getComponent(enemy, PositionConstructor);
            const diff = sumVector(
                position,
                mulVector(CENTER_CARD_POSITION, -1),
                cardPosition,
            );

            if (abs(diff.x) > HALF_CARD_SIZE || abs(diff.y) > HALF_CARD_SIZE) {
                heap.unregisterEntity(enemy);
            }
        });
    }

    function spawn() {
        const enemy = new EnemyEntity();
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
            const position = getComponent(enemy, PositionConstructor);
            const seedPosition = sumVector(
                suitableItem,
                mulVector(cardPosition, -1),
            );

            setVector(position, seedPosition);

            heap.registerEntity(enemy);
        } else {
            debugger;
        }
    }
}
