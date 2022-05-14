import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { PositionConstructor } from '../../Components/Position';
import { HealBarMeshComponent } from '../../Components/Renders/HealBarMeshComponent';
import { VisualSizeConstructor } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { mulVector, newVector, setVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function healBarRenderSystem(heap: Heap, ticker: TasksScheduler): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionConstructor);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = heap.getEntities(
            (e): e is Entity<HealBarMeshComponent | PositionConstructor> =>
                hasComponent(e, HealBarMeshComponent) &&
                hasComponent(e, PositionConstructor) &&
                hasComponent(e, VisualSizeConstructor),
        );

        Enumerable.from(entities).forEach((entity) => {
            const size = getComponent(entity, VisualSizeConstructor);
            const position = getComponent(entity, PositionConstructor);
            const healBar = getComponent(entity, HealBarMeshComponent);

            setVector(
                healBar.object.position,
                sumVector(
                    mulVector(
                        sumVector(
                            worldToRenderPosition(position, cardPosition),
                            newVector(-0.5, -0.5),
                        ),
                        TILE_SIZE,
                    ),
                    newVector(0, size.h / 2 + 10),
                ),
            );
        });
    }
}
