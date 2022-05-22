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
import { atlases } from '../../Components/AtlasAnimation/atlases';
import {
    BaseMeshComponent,
    BaseMeshComponentID,
} from '../../Components/Renders/BaseMeshComponent';
import { $object } from '../../CONST';
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
            (e): e is SomeEntity<BaseMeshComponent | AtlasAnimationComponent> =>
                hasComponent(e, BaseMeshComponentID) &&
                hasComponent(e, AtlasAnimationComponentID),
        );

        entities.forEach((entity) => {
            const mesh = getComponentStruct(entity, BaseMeshComponentID);
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
    component: ExtractStruct<BaseMeshComponent>,
    animation: ExtractStruct<AtlasAnimationComponent>,
): void {
    updateAtlasAnimation(animation, delta);

    const mesh = component[$object];
    const atlas = atlases[animation.atlasName];
    const texture = atlas.list[animation.atlasFrame].texture;

    if (mesh && mesh.material.map !== texture) {
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
    }
}
