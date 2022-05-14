import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { PositionConstructor } from '../../Components/Position';
import { MeshComponent } from '../../Components/Renders/MeshComponent';
import { TILE_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { worldYToPositionZ } from '../../utils/positionZ';
import { Vector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function positionRenderSystem(heap: Heap, ticker: TasksScheduler): void {
    const cardEntity = [...heap.getEntities(isCardEntity)][0];
    const cardPosition = getComponent(cardEntity, PositionConstructor);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = heap.getEntities(
            (e): e is Entity<MeshComponent | PositionConstructor> =>
                hasComponent(e, MeshComponent) &&
                hasComponent(e, PositionConstructor),
        );

        Enumerable.from(entities).forEach((entity) => {
            const mesh = getComponent(entity, MeshComponent);
            const position = getComponent(entity, PositionConstructor);

            setPositionMesh(
                mesh,
                worldToRenderPosition(position, cardPosition),
            );
        });
    }
}

function setPositionMesh({ object }: MeshComponent, position: Vector): void {
    object.position.x = (position.x - 0.5) * TILE_SIZE;
    object.position.y = (position.y - 0.5) * TILE_SIZE;
    object.position.z = worldYToPositionZ(object.position.y);
}
