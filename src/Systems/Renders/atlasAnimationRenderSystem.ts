import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import {
    AtlasAnimationConstructor,
    updateAtlasAnimation,
} from '../../Components/AtlasAnimation';
import { MeshComponent } from '../../Components/Renders/MeshComponent';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function atlasAnimationRenderSystem(
    heap: Heap,
    ticker: TasksScheduler,
): void {
    ticker.addFrameInterval(tick, 1);

    function tick(delta: number) {
        const entities = heap.getEntities(
            (e): e is Entity<MeshComponent | AtlasAnimationConstructor> =>
                hasComponent(e, MeshComponent) &&
                hasComponent(e, AtlasAnimationConstructor),
        );

        Enumerable.from(entities).forEach((entity) => {
            const mesh = getComponent(entity, MeshComponent);
            const animation = getComponent(entity, AtlasAnimationConstructor);

            animate(delta, mesh, animation);
        });
    }
}

function animate(
    delta: number,
    component: MeshComponent,
    animation: AtlasAnimationConstructor,
): void {
    updateAtlasAnimation(animation, delta);

    if (component.object.material.map !== animation.atlasFrame.texture) {
        component.object.material.map = animation.atlasFrame.texture;
        component.object.material.needsUpdate = true;
    }
}
