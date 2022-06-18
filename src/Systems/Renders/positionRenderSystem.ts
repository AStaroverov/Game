import { ExtractStruct } from '../../../lib/ECS/Component';
import { getComponentStruct, hasComponent, SomeEntity } from '../../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../../lib/ECS/Heap';
import { PositionComponent, PositionComponentID } from '../../Components/Position';
import { BaseMeshComponent, BaseMeshComponentID } from '../../Components/Renders/BaseMeshComponent';
import { $ref, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { worldYToPositionZ } from '../../utils/positionZ';
import { TVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function positionRenderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (entity): entity is SomeEntity<BaseMeshComponent | PositionComponent> =>
                hasComponent(entity, BaseMeshComponentID) &&
                hasComponent(entity, PositionComponentID),
        );

        entities.forEach((entity) => {
            const mesh = getComponentStruct(entity, BaseMeshComponentID);
            const position = getComponentStruct(entity, PositionComponentID);

            setPositionMesh(mesh, worldToRenderPosition(position, cardPosition));
        });
    }
}

function setPositionMesh(struct: ExtractStruct<BaseMeshComponent>, position: TVector): void {
    const mesh = struct[$ref];

    if (mesh !== undefined) {
        mesh.position.x = (position.x - 0.5) * TILE_SIZE;
        mesh.position.y = (position.y - 0.5) * TILE_SIZE;
        mesh.position.z = worldYToPositionZ(mesh.position.y);
    }
}
