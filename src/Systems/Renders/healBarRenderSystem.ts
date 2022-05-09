import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { HealBarMeshComponent } from '../../Components/HealBarMeshComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { VisualSizeComponent } from '../../Components/VisualSizeComponent';
import { TILE_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { mulVector, newVector, setVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function healBarRenderSystem(heap: Heap, ticker: TasksScheduler): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionComponent);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = heap.getEntities(
            (e): e is Entity<HealBarMeshComponent | PositionComponent> =>
                hasComponent(e, HealBarMeshComponent) &&
                hasComponent(e, PositionComponent) &&
                hasComponent(e, VisualSizeComponent),
        );

        Enumerable.from(entities).forEach((entity) => {
            const size = getComponent(entity, VisualSizeComponent);
            const position = getComponent(entity, PositionComponent);
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
