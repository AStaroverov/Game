import { getComponent, hasComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { Entity } from '../../lib/ECS/types';
import Enumerable from '../../lib/linq';
import { DirectionComponent } from '../Components/DirectionComponent';
import { PositionComponent } from '../Components/PositionComponent';
import { VelocityComponent } from '../Components/VelocityComponent';
import { mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function positionBodySystem(heap: Heap, ticker: TasksScheduler): void {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        const bodies = heap.getEntities(
            (
                e,
            ): e is Entity<
                PositionComponent | DirectionComponent | VelocityComponent
            > =>
                hasComponent(e, PositionComponent) &&
                hasComponent(e, DirectionComponent) &&
                hasComponent(e, VelocityComponent),
        );

        Enumerable.from(bodies).forEach((body) => {
            const position = getComponent(body, PositionComponent);
            const direction = getComponent(body, DirectionComponent);
            const velocity = getComponent(body, VelocityComponent);

            setVector(
                position,
                sumVector(position, mulVector(direction, velocity.v)),
            );
        });
    }
}
