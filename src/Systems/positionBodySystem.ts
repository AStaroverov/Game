import { getComponentStruct, hasComponent, SomeEntity } from '../../lib/ECS/Entity';
import { filterEntities } from '../../lib/ECS/Heap';
import { DirectionComponent, DirectionComponentID } from '../Components/DirectionComponent';
import { PositionComponent, PositionComponentID } from '../Components/Position';
import { VelocityComponent, VelocityComponentID } from '../Components/Velocity';
import { GameHeap } from '../heap';
import { mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function positionBodySystem(heap: GameHeap, ticker: TasksScheduler): void {
    ticker.addFrameInterval(tick, 1);

    function tick(delta: number) {
        const entities = filterEntities(
            heap,
            (e): e is SomeEntity<VelocityComponent | DirectionComponent | PositionComponent> =>
                hasComponent(e, PositionComponentID) &&
                hasComponent(e, DirectionComponentID) &&
                hasComponent(e, VelocityComponentID),
        );

        entities.forEach((entity) => {
            const position = getComponentStruct(entity, PositionComponentID);
            const direction = getComponentStruct(entity, DirectionComponentID);
            const velocity = getComponentStruct(entity, VelocityComponentID);

            setVector(position, sumVector(position, mulVector(direction, delta * velocity.v)));
        });
    }
}
