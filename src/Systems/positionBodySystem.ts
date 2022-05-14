import { getComponent, hasComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { Entity } from '../../lib/ECS/types';
import Enumerable from '../../lib/linq';
import { DirectionComponent } from '../Components/DirectionComponent';
import { PositionConstructor } from '../Components/Position';
import { VelocityConstructor } from '../Components/Velocity';
import { mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function positionBodySystem(heap: Heap, ticker: TasksScheduler): void {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        const bodies = heap.getEntities(
            (
                e,
            ): e is Entity<
                PositionConstructor | DirectionComponent | VelocityConstructor
            > =>
                hasComponent(e, PositionConstructor) &&
                hasComponent(e, DirectionComponent) &&
                hasComponent(e, VelocityConstructor),
        );

        Enumerable.from(bodies).forEach((body) => {
            const position = getComponent(body, PositionConstructor);
            const direction = getComponent(body, DirectionComponent);
            const velocity = getComponent(body, VelocityConstructor);

            setVector(
                position,
                sumVector(position, mulVector(direction, velocity.v)),
            );
        });
    }
}
