import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { MeshComponent } from '../../Components/Renders/MeshComponent';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function rotateRenderSystem(heap: Heap, ticker: TasksScheduler): void {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = heap.getEntities(
            (e): e is Entity<MeshComponent & DirectionComponent> => {
                return (
                    hasComponent(e, MeshComponent) &&
                    hasComponent(e, DirectionComponent)
                );
            },
        );
        Enumerable.from(entities).forEach((entity) => {
            const mesh = getComponent(entity, MeshComponent);
            const dir = getComponent(entity, DirectionComponent);

            rotate(mesh, dir);
        });
    }
}

function rotate(mesh: MeshComponent, direction: DirectionComponent) {
    if (direction.x > 0) {
        mesh.object.scale.x = 1;
    }
    if (direction.x < 0) {
        mesh.object.scale.x = -1;
    }
}
