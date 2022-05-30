import {
    getComponentStruct,
    hasComponent,
    SomeEntity,
} from '../../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../../lib/ECS/Heap';
import {
    PositionComponent,
    PositionComponentID,
} from '../../Components/Position';
import {
    HealBarMeshComponent,
    HealBarMeshComponentID,
} from '../../Components/Renders/HealBarMeshComponent';
import {
    VisualSizeComponent,
    VisualSizeComponentID,
} from '../../Components/VisualSize';
import { $ref, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { mulVector, newVector, setVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function healBarRenderSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (
                e,
            ): e is SomeEntity<
                HealBarMeshComponent | PositionComponent | VisualSizeComponent
            > =>
                hasComponent(e, HealBarMeshComponentID) &&
                hasComponent(e, PositionComponentID) &&
                hasComponent(e, VisualSizeComponentID),
        );

        entities.forEach((entity) => {
            const size = getComponentStruct(entity, VisualSizeComponentID);
            const position = getComponentStruct(entity, PositionComponentID);
            const healBar = getComponentStruct(entity, HealBarMeshComponentID);
            const group = healBar[$ref];

            if (group) {
                const nextPosition = sumVector(
                    mulVector(
                        sumVector(
                            worldToRenderPosition(position, cardPosition),
                            newVector(-0.5, -0.5),
                        ),
                        TILE_SIZE,
                    ),
                    newVector(0, size.h / 2 + 10),
                );

                setVector(group.position, nextPosition);
            }
        });
    }
}
