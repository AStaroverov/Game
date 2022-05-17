import { Scene } from 'three';

import {
    getStruct,
    isInheritedComponent,
    NullableComponent,
    SomeComponent,
} from '../../../lib/ECS/Component';
import {
    filterComponents,
    getComponentStruct,
    hasInheritedComponent,
    SomeEntity,
    tryGetComponentStruct,
} from '../../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../../lib/ECS/Heap';
import { ReliefMeshesMatrixID } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { SurfaceMeshesMatrixID } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import {
    PositionComponent,
    PositionComponentID,
} from '../../Components/Position';
import { SpotLightMeshComponentID } from '../../Components/Renders/LightComponent';
import {
    MeshComponent,
    MeshComponentID,
    MeshStruct,
} from '../../Components/Renders/MeshComponent';
import {
    MeshGroupComponent,
    MeshGroupComponentID,
    MeshGroupStruct,
} from '../../Components/Renders/MeshGroupComponent';
import { CENTER_CARD_POSITION, HALF_RENDER_CARD_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { GameHeap } from '../../heap';
import { abs } from '../../utils/math';
import { mulVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function meshesSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
    scene: Scene,
): void {
    const globalLightEntity = getEntities(heap, GlobalLightEntityID)[0];
    const spotLight = getComponentStruct(
        globalLightEntity,
        SpotLightMeshComponentID,
    );

    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    const surfaceMeshes = getComponentStruct(cardEntity, SurfaceMeshesMatrixID);
    const reliefMeshes = getComponentStruct(cardEntity, ReliefMeshesMatrixID);

    const staticMeshes = [
        spotLight.object,
        spotLight.object.target,
        ...surfaceMeshes.matrix.toArray(),
        ...reliefMeshes.matrix.toArray(),
    ];

    ticker.addFrameInterval(tick, 1);

    function tick() {
        scene.clear();
        scene.add(...staticMeshes);

        const meshEntities = filterEntities(
            heap,
            (
                e,
            ): e is SomeEntity<
                | NullableComponent<SomeComponent<MeshStruct>>
                | NullableComponent<SomeComponent<MeshGroupStruct>>
            > =>
                hasInheritedComponent(e, MeshComponentID) ||
                hasInheritedComponent(e, MeshGroupComponentID),
        );

        meshEntities.forEach((entity) => {
            const mesh = filterComponents(entity, (c): c is MeshComponent =>
                isInheritedComponent(c, MeshComponentID),
            );
            const group = filterComponents(
                entity,
                (c): c is MeshGroupComponent =>
                    isInheritedComponent(c, MeshGroupComponentID),
            );
            const position = tryGetComponentStruct<PositionComponent>(
                entity,
                PositionComponentID,
            );

            const diff =
                position &&
                sumVector(
                    position,
                    mulVector(CENTER_CARD_POSITION, -1),
                    cardPosition,
                );
            const isVisible =
                diff &&
                !(
                    abs(diff.x) > HALF_RENDER_CARD_SIZE + 5 ||
                    abs(diff.y) > HALF_RENDER_CARD_SIZE + 5
                );

            [...mesh, ...group]
                .map(getStruct)
                .map((struct) =>
                    'mesh' in struct ? struct.mesh : struct.group,
                )
                .forEach((object) => {
                    scene.add(object);

                    if (isVisible !== undefined) {
                        object.visible = isVisible;
                    }
                });
        });
    }
}
