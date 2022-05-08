import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { TILE_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { worldYToPositionZ } from '../../utils/positionZ';
import { Vector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function positionBodyRenderSystem(
    heap: Heap,
    ticker: TasksScheduler,
): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionComponent);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = heap.getEntities(
            (e): e is Entity<MeshBasicComponent | PositionComponent> =>
                hasComponent(e, MeshBasicComponent) &&
                hasComponent(e, PositionComponent),
        );

        Enumerable.from(entities).forEach((entity) => {
            const mesh = getComponent(entity, MeshBasicComponent);
            const position = getComponent(entity, PositionComponent);

            setPositionMesh(
                mesh,
                worldToRenderPosition(position, cardPosition),
            );
        });
    }
}

function setPositionMesh({ mesh }: MeshBasicComponent, position: Vector): void {
    mesh.position.x = (position.x - 0.5) * TILE_SIZE;
    mesh.position.y = (position.y - 0.5) * TILE_SIZE;
    mesh.position.z = worldYToPositionZ(mesh.position.y);
}
