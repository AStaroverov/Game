import { Scene } from 'three';

import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { ReliefMeshesMatrixComponent } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { SurfaceMeshesMatrixComponent } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { CENTER_CARD_POSITION, HALF_RENDER_CARD_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { abs } from '../../utils/math';
import { mulVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function meshesSystem(
    ticker: TasksScheduler,
    scene: Scene,
    heap: Heap,
): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionComponent);

    const surfaceMeshes = getComponent(
        cardEntity,
        SurfaceMeshesMatrixComponent,
    );
    const reliefMeshes = getComponent(cardEntity, ReliefMeshesMatrixComponent);

    const staticMeshes = [
        ...surfaceMeshes.matrix.toArray(),
        ...reliefMeshes.matrix.toArray(),
    ];

    ticker.addFrameInterval(tick, 1);

    function tick() {
        scene.clear();
        scene.add(...staticMeshes);

        const entities = heap.getEntities(
            (e): e is Entity<MeshBasicComponent> =>
                hasComponent(e, MeshBasicComponent),
        );

        Enumerable.from(entities).forEach((entity) => {
            const { mesh } = getComponent(entity, MeshBasicComponent);
            const position = getComponent(entity, PositionComponent);

            scene.add(mesh);

            if (position) {
                const diff = sumVector(
                    position,
                    mulVector(CENTER_CARD_POSITION, -1),
                    cardPosition,
                );

                mesh.visible = !(
                    abs(diff.x) > HALF_RENDER_CARD_SIZE ||
                    abs(diff.y) > HALF_RENDER_CARD_SIZE
                );
            }
        });
    }
}
