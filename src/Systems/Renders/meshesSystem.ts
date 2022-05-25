import { Scene } from 'three';

import { InheritedComponent } from '../../../lib/ECS/Component';
import {
    getComponentStruct,
    getInheritedComponentStructs,
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
} from '../../Components/Renders/MeshComponent';
import {
    MeshGroupComponent,
    MeshGroupComponentID,
} from '../../Components/Renders/MeshGroupComponent';
import {
    $object,
    CENTER_CARD_POSITION,
    HALF_RENDER_CARD_SIZE,
} from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { GameHeap } from '../../heap';
import { abs } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
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

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const staticMeshes = [
            spotLight[$object],
            spotLight[$object]?.target,
            ...Matrix.toArray(surfaceMeshes.matrix).map((v) => v[$object]),
            ...Matrix.toArray(reliefMeshes.matrix).map((v) => v[$object]),
        ].filter(
            <T>(object: undefined | T): object is T => object !== undefined,
        );

        const meshEntities = filterEntities(
            heap,
            (
                e,
            ): e is
                | SomeEntity<InheritedComponent<MeshComponent>>
                | SomeEntity<InheritedComponent<MeshGroupComponent>> => {
                return (
                    hasInheritedComponent(e, MeshComponentID) ||
                    hasInheritedComponent(e, MeshGroupComponentID)
                );
            },
        );

        scene.clear();

        if (staticMeshes.length > 0) {
            scene.add(...staticMeshes);
        }

        meshEntities.forEach((entity) => {
            const mesh = getInheritedComponentStructs(entity, MeshComponentID);
            const group = getInheritedComponentStructs(
                entity,
                MeshGroupComponentID,
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

            [...mesh, ...group].forEach((withObject) => {
                const object = withObject[$object];

                if (object) {
                    scene.add(object);

                    if (isVisible !== undefined) {
                        object.visible = isVisible;
                    }
                }
            });
        });
    }
}
