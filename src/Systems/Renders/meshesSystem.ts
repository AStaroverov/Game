import { Scene } from 'three';

import {
    getComponent,
    getComponents,
    hasComponent,
} from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { ReliefMeshesMatrixComponent } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { SurfaceMeshesMatrixComponent } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { PositionConstructor } from '../../Components/Position';
import { SpotLightMeshComponent } from '../../Components/Renders/LightComponent';
import { MeshComponent } from '../../Components/Renders/MeshComponent';
import { MeshGroupComponent } from '../../Components/Renders/MeshGroupComponent';
import { CENTER_CARD_POSITION, HALF_RENDER_CARD_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { isGlobalLightEntity } from '../../Entities/GlobalLight';
import { abs } from '../../utils/math';
import { mulVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function meshesSystem(
    ticker: TasksScheduler,
    scene: Scene,
    heap: Heap,
): void {
    const globalLightEntity = [...heap.getEntities(isGlobalLightEntity)][0];
    const spotLight = getComponent(globalLightEntity, SpotLightMeshComponent);
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionConstructor);
    const surfaceMeshes = getComponent(
        cardEntity,
        SurfaceMeshesMatrixComponent,
    );
    const reliefMeshes = getComponent(cardEntity, ReliefMeshesMatrixComponent);

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

        const entities = heap.getEntities(
            (e): e is Entity<MeshComponent | MeshGroupComponent> =>
                hasComponent(e, MeshComponent) ||
                hasComponent(e, MeshGroupComponent),
        );

        Enumerable.from(entities).forEach((entity) => {
            const position = getComponent(entity, PositionConstructor);
            const meshes = getComponents(
                entity,
                (component): component is MeshComponent | MeshGroupComponent =>
                    component instanceof MeshComponent ||
                    component instanceof MeshGroupComponent,
            );

            const diff =
                position &&
                sumVector(
                    position,
                    mulVector(CENTER_CARD_POSITION, -1),
                    cardPosition,
                );
            const visible =
                position &&
                !(
                    abs(diff.x) > HALF_RENDER_CARD_SIZE + 5 ||
                    abs(diff.y) > HALF_RENDER_CARD_SIZE + 5
                );

            Enumerable.from(meshes).forEach((mesh) => {
                mesh && scene.add(mesh.object);

                if (visible !== undefined) {
                    mesh.object.visible = visible;
                }
            });
        });
    }
}
