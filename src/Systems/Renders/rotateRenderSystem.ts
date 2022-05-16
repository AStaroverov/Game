import {
    Entity,
    getComponentBody,
    hasComponent,
} from '../../../lib/ECS/Entity';
import { filterEntities } from '../../../lib/ECS/Heap';
import Enumerable from '../../../lib/linq';
import {
    DirectionComponent,
    DirectionComponentID,
} from '../../Components/DirectionComponent';
import {
    MeshComponent,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
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
        Enumerable.from(entities).forEach((entity) => {
            const mesh = getComponentBody(entity, MeshComponentID);
            const dir = getComponentBody(entity, DirectionComponentID);

            rotate(mesh, dir);
        });
    }
}

function rotate(
    mesh: MeshComponent['body'],
    direction: DirectionComponent['body'],
) {
    if (direction.x > 0) {
        mesh.object.scale.x = 1;
    }
    if (direction.x < 0) {
        mesh.object.scale.x = -1;
    }
}
