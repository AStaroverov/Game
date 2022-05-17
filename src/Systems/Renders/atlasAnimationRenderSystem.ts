import { ExtractStruct } from '../../../lib/ECS/Component';
import {
    getComponentStruct,
    hasComponent,
    SomeEntity,
} from '../../../lib/ECS/Entity';
import { filterEntities } from '../../../lib/ECS/Heap';
import {
    AtlasAnimationComponent,
    AtlasAnimationComponentID,
    updateAtlasAnimation,
} from '../../Components/AtlasAnimation';
import {
    MeshComponent,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function atlasAnimationRenderSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
): void {
    ticker.addFrameInterval(tick, 1);

    function tick(delta: number) {
        const entities = filterEntities(
            heap,
            (e): e is SomeEntity<MeshComponent | AtlasAnimationComponent> =>
                hasComponent(e, MeshComponentID) &&
                hasComponent(e, AtlasAnimationComponentID),
        );

        entities.forEach((entity) => {
            const mesh = getComponentStruct(entity, MeshComponentID);
            const animation = getComponentStruct(
                entity,
                AtlasAnimationComponentID,
            );

            animate(delta, mesh, animation);
        });
    }
}

function animate(
    delta: number,
    component: ExtractStruct<MeshComponent>,
    animation: ExtractStruct<AtlasAnimationComponent>,
): void {
    updateAtlasAnimation(animation, delta);

    if (component.mesh.material.map !== animation.atlasFrame.texture) {
        component.mesh.material.map = animation.atlasFrame.texture;
        component.mesh.material.needsUpdate = true;
    }
}
