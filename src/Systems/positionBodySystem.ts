import { getComponentBody, hasComponent } from '../../lib/ECS/Entity';
import {
    ExtractEntitiesByComponentShallowTag,
    filterEntities,
} from '../../lib/ECS/Heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import { PositionComponentID } from '../Components/Position';
import { VelocityComponentID } from '../Components/Velocity';
import { GameHeap } from '../heap';
import { mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function positionBodySystem(
    heap: GameHeap,
    ticker: TasksScheduler,
): void {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (
                e,
            ): e is ExtractEntitiesByComponentShallowTag<
                typeof e,
                | typeof VelocityComponentID
                | typeof DirectionComponentID
                | typeof PositionComponentID
            > =>
                hasComponent(e, PositionComponentID) &&
                hasComponent(e, DirectionComponentID) &&
                hasComponent(e, VelocityComponentID),
        );

        entities.forEach((entity) => {
            const position = getComponentBody(entity, PositionComponentID);
            const direction = getComponentBody(entity, DirectionComponentID);
            const velocity = getComponentBody(entity, VelocityComponentID);

            setVector(
                position,
                sumVector(position, mulVector(direction, velocity.v)),
            );
        });
    }
}
