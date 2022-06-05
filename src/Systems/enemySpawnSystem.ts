import { getComponentStruct } from '../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../lib/ECS/Heap';
import Enumerable from '../../lib/linq';
import { TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { Tile } from '../Components/Matrix/TilesMatrix/def';
import { PositionComponentID } from '../Components/Position';
import { CardEntityID } from '../Entities/Card';
import { createEnemyEntity, EnemyEntityID } from '../Entities/Enemy';
import { GameHeap } from '../heap';
import { abs, floor } from '../utils/math';
import { Item, radialIterate } from '../utils/Matrix/radialIterate';
import { random } from '../utils/random';
import { mulVector, newVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function EnemySpawnSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    ticker.addTimeInterval(tick, 1000);

    function tick() {
        const enemies = getEntities(heap, EnemyEntityID);

        if (enemies.length < 1) {
            spawn();
        }
    }

    function spawn() {
        const start = newVector(
            floor(cardTiles.matrix.w / 2), // Start must be relative to user
            floor(cardTiles.matrix.h / 2),
        );
        const suitableItem = Enumerable.from(
            radialIterate(cardTiles.matrix, start.x, start.y),
        )
            .where((tile): tile is Item<Tile> => tile !== undefined)
            .firstOrDefault(({ x, y, value }) => {
                const dist = abs(start.x + start.y - (x + y));

                return value.passable && dist > 10 && random() > 0.9;
            });

        if (suitableItem) {
            const enemy = createEnemyEntity();
            const position = getComponentStruct(enemy, PositionComponentID);
            const seedPosition = sumVector(
                suitableItem,
                mulVector(cardPosition, -1),
            );

            setVector(position, seedPosition);

            addEntity(heap, enemy);
        }
    }
}
