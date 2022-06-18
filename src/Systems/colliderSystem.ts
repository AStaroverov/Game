import { getComponentStruct, hasComponent, SomeEntity } from '../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../lib/ECS/Heap';
import { DirectionComponent, DirectionComponentID } from '../Components/DirectionComponent';
import { TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { isPassableTileType } from '../Components/Matrix/TilesMatrix/def';
import { PositionComponent, PositionComponentID } from '../Components/Position';
import { VelocityComponent, VelocityComponentID } from '../Components/Velocity';
import { CardEntityID } from '../Entities/Card';
import { GameHeap } from '../heap';
import { floor, round } from '../utils/math';
import { Matrix } from '../utils/Matrix';
import { isEqualVectors, mapVector, mulVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function colliderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const tiles = getComponentStruct(cardEntity, TilesMatrixID);

    ticker.addFrameInterval(tick, 1);

    function tick(delta: number) {
        const entities = filterEntities(
            heap,
            (e): e is SomeEntity<PositionComponent | DirectionComponent | VelocityComponent> =>
                hasComponent(e, PositionComponentID) &&
                hasComponent(e, DirectionComponentID) &&
                hasComponent(e, VelocityComponentID),
        );

        entities.forEach((entity) => {
            const direction = getComponentStruct(entity, DirectionComponentID);
            const velocity = getComponentStruct(entity, VelocityComponentID);
            const position = getComponentStruct(entity, PositionComponentID);

            if (velocity.v === 0) return;

            const shift = mulVector(direction, velocity.v * delta);
            const next = sumVector(position, shift);
            const isNextTile = !isEqualVectors(mapVector(position, floor), mapVector(next, floor));

            if (isNextTile) {
                const coord = mapVector(sumVector(direction, next, cardPosition), round);
                const tile = Matrix.get(tiles.matrix, coord.x, coord.y);

                if (tile !== undefined && !isPassableTileType(tile.type)) {
                    velocity.v = 0;
                }
            }
        });
    }
}
