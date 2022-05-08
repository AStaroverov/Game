import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import {
    AtlasAnimationComponent,
    updateAtlasAnimation,
} from '../../Components/AtlasAnimationComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function atlasAnimationRenderSystem(
    heap: Heap,
    ticker: TasksScheduler,
): void {
    ticker.addFrameInterval(tick, 1);

    function tick(delta: number) {
        const entities = heap.getEntities(
            (e): e is Entity<MeshBasicComponent | AtlasAnimationComponent> =>
                hasComponent(e, MeshBasicComponent) &&
                hasComponent(e, AtlasAnimationComponent),
        );

        Enumerable.from(entities).forEach((entity) => {
            const mesh = getComponent(entity, MeshBasicComponent);
            const animation = getComponent(entity, AtlasAnimationComponent);

            animate(delta, mesh, animation);
        });
    }
}

function animate(
    delta: number,
    component: MeshBasicComponent,
    animation: AtlasAnimationComponent,
): void {
    updateAtlasAnimation(animation, delta);

    if (component.mesh.material.map !== animation.atlasFrame.texture) {
        component.mesh.material.map = animation.atlasFrame.texture;
        component.mesh.material.needsUpdate = true;
    }
}
