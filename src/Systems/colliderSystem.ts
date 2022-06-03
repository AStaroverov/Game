import {
    getComponentStruct,
    hasComponent,
    SomeEntity,
} from '../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../lib/ECS/Heap';
import {
    DirectionComponent,
    DirectionComponentID,
} from '../Components/DirectionComponent';
import { TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { PositionComponent, PositionComponentID } from '../Components/Position';
import { VelocityComponent, VelocityComponentID } from '../Components/Velocity';
import { CardEntityID } from '../Entities/Card';
import { GameHeap } from '../heap';
import { floor, ufloor } from '../utils/math';
import { Matrix } from '../utils/Matrix';
import {
    isEqualVectors,
    mapVector,
    mulVector,
    sumVector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function colliderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const tiles = getComponentStruct(cardEntity, TilesMatrixID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (
                e,
            ): e is SomeEntity<
                PositionComponent | DirectionComponent | VelocityComponent
            > =>
                hasComponent(e, PositionComponentID) &&
                hasComponent(e, DirectionComponentID) &&
                hasComponent(e, VelocityComponentID),
        );

        entities.forEach((entity) => {
            const direction = getComponentStruct(entity, DirectionComponentID);
            const velocity = getComponentStruct(entity, VelocityComponentID);
            const position = getComponentStruct(entity, PositionComponentID);

            if (velocity.v === 0) return;

            const shift = mulVector(direction, velocity.v);
            const current = mapVector(position, floor);
            const next = mapVector(sumVector(position, shift), floor);

            if (!isEqualVectors(current, next)) {
                const coord = sumVector(next, mapVector(cardPosition, ufloor));
                const tile = Matrix.get(tiles.matrix, coord.x, coord.y);

                if (tile !== undefined && !tile.passable) {
                    velocity.v = 0;
                }
            }
        });
    }
}
