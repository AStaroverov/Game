import { ExtractStruct } from '../../../lib/ECS/Component';
import {
    Entity,
    getComponentStruct,
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
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

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
            const mesh = getComponentStruct(entity, MeshComponentID);
            const position = getComponentStruct(entity, PositionComponentID);

            setPositionMesh(
                mesh,
                worldToRenderPosition(position, cardPosition),
            );
        });
    }
}

function setPositionMesh(
    { mesh }: ExtractStruct<MeshComponent>,
    position: Vector,
): void {
    mesh.position.x = (position.x - 0.5) * TILE_SIZE;
    mesh.position.y = (position.y - 0.5) * TILE_SIZE;
    mesh.position.z = worldYToPositionZ(mesh.position.y);
}
