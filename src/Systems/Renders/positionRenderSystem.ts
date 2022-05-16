import {
    Entity,
    getComponentBody,
    hasComponent,
} from '../../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../../lib/ECS/Heap';
import {
    PositionComponent,
    PositionComponentID,
} from '../../Components/Position';
import {
    MeshComponent,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
import { TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { worldYToPositionZ } from '../../utils/positionZ';
import { Vector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function positionRenderSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentBody(cardEntity, PositionComponentID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (
                entity,
            ): entity is Entity<any, MeshComponent | PositionComponent> =>
                hasComponent(entity, MeshComponentID) &&
                hasComponent(entity, PositionComponentID),
        );

        entities.forEach((entity) => {
            const mesh = getComponentBody(entity, MeshComponentID);
            const position = getComponentBody(entity, PositionComponentID);

            setPositionMesh(
                mesh,
                worldToRenderPosition(position, cardPosition),
            );
        });
    }
}

function setPositionMesh(
    { object }: MeshComponent['body'],
    position: Vector,
): void {
    object.position.x = (position.x - 0.5) * TILE_SIZE;
    object.position.y = (position.y - 0.5) * TILE_SIZE;
    object.position.z = worldYToPositionZ(object.position.y);
}
