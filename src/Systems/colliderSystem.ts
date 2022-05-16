import { getComponentBody, hasComponent } from '../../lib/ECS/Entity';
import {
    ExtractEntitiesByComponentShallowTag,
    filterEntities,
    getEntities,
} from '../../lib/ECS/Heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import { TilesMatrixID, TileType } from '../Components/Matrix/TilesMatrix';
import { PositionComponentID } from '../Components/Position';
import { VelocityComponentID } from '../Components/Velocity';
import { CardEntityID } from '../Entities/Card';
import { GameHeap } from '../heap';
import { floor, ufloor } from '../utils/math';
import {
    isEqualVectors,
    mapVector,
    mulVector,
    sumVector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function colliderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentBody(cardEntity, PositionComponentID);
    const tiles = getComponentBody(cardEntity, TilesMatrixID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (
                e,
            ): e is ExtractEntitiesByComponentShallowTag<
                typeof e,
                | typeof PositionComponentID
                | typeof DirectionComponentID
                | typeof VelocityComponentID
            > =>
                hasComponent(e, PositionComponentID) &&
                hasComponent(e, DirectionComponentID) &&
                hasComponent(e, VelocityComponentID),
        );

        entities.forEach((entity) => {
            const direction = getComponentBody(entity, DirectionComponentID);
            const velocity = getComponentBody(entity, VelocityComponentID);
            const position = getComponentBody(entity, PositionComponentID);

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
