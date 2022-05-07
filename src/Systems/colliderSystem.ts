import { getComponent, hasComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { Entity } from '../../lib/ECS/types';
import Enumerable from '../../lib/linq';
import { DirectionComponent } from '../Components/DirectionComponent';
import {
    TilesMatrixComponent,
    TileType,
} from '../Components/Matrix/TilesMatrixComponent';
import { PositionComponent } from '../Components/PositionComponent';
import { VelocityComponent } from '../Components/VelocityComponent';
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
    const cardPosition = getComponent(cardEntity, PositionComponent);
    const tiles = getComponent(cardEntity, TilesMatrixComponent);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const bodies = heap.getEntities(
            (
                e,
            ): e is Entity<
                PositionComponent & DirectionComponent & VelocityComponent
            > =>
                hasComponent(e, PositionComponent) &&
                hasComponent(e, DirectionComponent) &&
                hasComponent(e, VelocityComponent),
        );

        Enumerable.from(bodies).forEach((body) => {
            const direction = getComponent(body, DirectionComponent);
            const position = getComponent(body, PositionComponent);
            const velocity = getComponent(body, VelocityComponent);

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
