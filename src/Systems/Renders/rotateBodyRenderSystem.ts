import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function rotateBodyRenderSystem(
    heap: Heap,
    ticker: TasksScheduler,
): void {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = heap.getEntities(
            (e): e is Entity<MeshBasicComponent & DirectionComponent> => {
                return (
                    hasComponent(e, MeshBasicComponent) &&
                    hasComponent(e, DirectionComponent)
                );
            },
        );
        Enumerable.from(entities).forEach((entity) => {
            const mesh = getComponent(entity, MeshBasicComponent);
            const dir = getComponent(entity, DirectionComponent);

            rotate(mesh, dir);
        });
    }
}

function rotate(mesh: MeshBasicComponent, direction: DirectionComponent) {
    if (direction.x > 0) {
        mesh.mesh.scale.x = 1;
    }
    if (direction.x < 0) {
        mesh.mesh.scale.x = -1;
    }
}
