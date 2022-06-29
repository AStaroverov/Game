import { ExtractStruct } from '../../../lib/ECS/Component';
import { Entity, getComponentStruct, hasComponent } from '../../../lib/ECS/Entity';
import { filterEntities } from '../../../lib/ECS/Heap';
import { DirectionComponent, DirectionComponentID } from '../../Components/DirectionComponent';
import { BaseMeshComponent, BaseMeshComponentID } from '../../Components/Renders/BaseMeshComponent';
import { $ref } from '../../CONST';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function RotateRenderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (e): e is Entity<any, BaseMeshComponent | DirectionComponent> => {
                return (
                    hasComponent(e, BaseMeshComponentID) && hasComponent(e, DirectionComponentID)
                );
            },
        );
        entities.forEach((entity) => {
            const mesh = getComponentStruct(entity, BaseMeshComponentID);
            const dir = getComponentStruct(entity, DirectionComponentID);

            rotate(mesh, dir);
        });
    }
}

function rotate(
    mesh: ExtractStruct<BaseMeshComponent>,
    direction: ExtractStruct<DirectionComponent>,
) {
    if (mesh[$ref] === undefined) return;

    if (direction.x > 0) {
        mesh[$ref]!.scale.x = 1;
    }
    if (direction.x < 0) {
        mesh[$ref]!.scale.x = -1;
    }
}
