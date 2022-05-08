import { Scene } from 'three';

import { getComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { ReliefMeshesMatrixComponent } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { SurfaceMeshesMatrixComponent } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { isCardEntity } from '../../Entities/Card';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function meshesSystem(
    ticker: TasksScheduler,
    scene: Scene,
    heap: Heap,
): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
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
        const meshes = [
            ...heap.getComponents(
                (comp): comp is MeshBasicComponent =>
                    comp instanceof MeshBasicComponent,
            ),
        ].map((value) => value.mesh);

        scene.clear();
        scene.add(...staticMeshes, ...meshes);
    }
}
