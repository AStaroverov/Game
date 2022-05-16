import { Scene } from 'three';

import {
    Entity,
    getComponent,
    getComponentBody,
    hasComponent,
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
import { CardEntityID } from '../../Entities/Card';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function meshesSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
    scene: Scene,
): void {
    const globalLightEntity = getEntities(heap, GlobalLightEntityID)[0];
    const spotLight = getComponentBody(
        globalLightEntity,
        SpotLightMeshComponentID,
    );

    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentBody(cardEntity, PositionComponentID);

    const surfaceMeshes = getComponentBody(cardEntity, SurfaceMeshesMatrixID);
    const reliefMeshes = getComponentBody(cardEntity, ReliefMeshesMatrixID);

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
            ): e is
                | Entity<any, MeshComponent>
                | Entity<any, MeshGroupComponent> =>
                hasComponent(e, MeshComponentID) ||
                hasComponent(e, MeshGroupComponentID),
        );

        const positionedEntities = filterEntities(
            heap,
            (
                e,
            ): e is Entity<any, PositionComponent> &
                Entity<any, MeshComponent | MeshGroupComponent> =>
                hasComponent(e, PositionComponentID) &&
                (hasComponent(e, MeshComponentID) ||
                    hasComponent(e, MeshGroupComponentID)),
        );

        meshEntities.forEach((entity) => {
            if (hasComponent(entity, MeshComponentID)) {
                const mesh = getComponent(entity, MeshComponentID);
                scene.add(mesh.object);
            }

            const group = getComponentBody(entity, MeshGroupComponentID);

            mesh && scene.add(mesh.object);
        });

        // meshEntities.forEach((entity) => {
        //     const position = getComponentBody(entity, PositionComponentID);
        //     const meshes = filterComponents(
        //         entity,
        //         (component): component is MeshComponent | MeshGroupComponent =>
        //             component instanceof MeshComponent ||
        //             component instanceof MeshGroupComponent,
        //     );
        //
        //     const diff =
        //         position &&
        //         sumVector(
        //             position,
        //             mulVector(CENTER_CARD_POSITION, -1),
        //             cardPosition,
        //         );
        //     const visible =
        //         position &&
        //         !(
        //             abs(diff.x) > HALF_RENDER_CARD_SIZE + 5 ||
        //             abs(diff.y) > HALF_RENDER_CARD_SIZE + 5
        //         );
        //
        //     meshes.forEach((mesh) => {
        //         mesh && scene.add(mesh.object);
        //
        //         if (visible !== undefined) {
        //             mesh.object.visible = visible;
        //         }
        //     });
        // });
    }
}
