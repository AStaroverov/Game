import { ExtractStruct } from '../../../lib/ECS/Component';
import {
    Entity,
    getComponentStruct,
    hasComponent,
} from '../../../lib/ECS/Entity';
import { filterEntities } from '../../../lib/ECS/Heap';
import {
    DirectionComponent,
    DirectionComponentID,
} from '../../Components/DirectionComponent';
import {
    MeshComponent,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
import { $object } from '../../CONST';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function rotateRenderSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
): void {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (e): e is Entity<any, MeshComponent | DirectionComponent> => {
                return (
                    hasComponent(e, MeshComponentID) &&
                    hasComponent(e, DirectionComponentID)
                );
            },
        );
        entities.forEach((entity) => {
            const mesh = getComponentStruct(entity, MeshComponentID);
            const dir = getComponentStruct(entity, DirectionComponentID);

            rotate(mesh, dir);
        });
    }
}

function rotate(
    mesh: ExtractStruct<MeshComponent>,
    direction: ExtractStruct<DirectionComponent>,
) {
    if (mesh[$object] === undefined) return;

    if (direction.x > 0) {
        mesh[$object]!.scale.x = 1;
    }
    if (direction.x < 0) {
        mesh[$object]!.scale.x = -1;
    }
}
