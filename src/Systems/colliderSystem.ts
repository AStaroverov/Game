import { getComponent, hasComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { Entity } from '../../lib/ECS/types';
import Enumerable from '../../lib/linq';
import { DirectionComponent } from '../Components/DirectionComponent';
import {
    TilesMatrixConstructor,
    TileType,
} from '../Components/Matrix/TilesMatrix';
import { PositionConstructor } from '../Components/Position';
import { VelocityConstructor } from '../Components/Velocity';
import { isCardEntity } from '../Entities/Card';
import { floor, ufloor } from '../utils/math';
import {
    isEqualVectors,
    mapVector,
    mulVector,
    sumVector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function colliderSystem(heap: Heap, ticker: TasksScheduler): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionConstructor);
    const tiles = getComponent(cardEntity, TilesMatrixConstructor);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const bodies = heap.getEntities(
            (
                e,
            ): e is Entity<
                PositionConstructor & DirectionComponent & VelocityConstructor
            > =>
                hasComponent(e, PositionConstructor) &&
                hasComponent(e, DirectionComponent) &&
                hasComponent(e, VelocityConstructor),
        );

        Enumerable.from(bodies).forEach((body) => {
            const direction = getComponent(body, DirectionComponent);
            const position = getComponent(body, PositionConstructor);
            const velocity = getComponent(body, VelocityConstructor);

            if (velocity.v === 0) return;

            const shift = mulVector(direction, velocity.v);
            const current = mapVector(position, floor);
            const next = mapVector(sumVector(position, shift), floor);

            if (!isEqualVectors(current, next)) {
                const coord = sumVector(next, mapVector(cardPosition, ufloor));
                const tile = tiles.matrix.get(coord.x, coord.y);

                if (tile && tile.type !== TileType.passable) {
                    velocity.v = 0;
                }
            }
        });
    }
}
