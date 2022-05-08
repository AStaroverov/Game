import { getComponent, hasComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { Entity } from '../../../lib/ECS/types';
import Enumerable from '../../../lib/linq';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { isCardEntity } from '../../Entities/Card';
import { Vector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldPositionToRenderPosition } from '../../utils/worldVectorToRenderVector';

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
                worldPositionToRenderPosition(position, cardPosition),
            );
        });
    }
}

function setPositionMesh(comp: MeshBasicComponent, position: Vector): void {
    comp.mesh.position.x = (position.x - 0.5) * TILE_SIZE;
    comp.mesh.position.y = (position.y - 0.5) * TILE_SIZE;
    comp.mesh.position.z = Math.floor(RENDER_CARD_SIZE / 4);
}
