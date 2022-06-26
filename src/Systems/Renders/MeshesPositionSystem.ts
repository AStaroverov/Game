import { ExtractStruct, InheritedComponent } from '../../../lib/ECS/Component';
import {
    getComponentStruct,
    getInheritedComponentStructs,
    hasInheritedComponent,
    SomeEntity,
} from '../../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../../lib/ECS/Heap';
import { PositionComponent, PositionComponentID } from '../../Components/Position';
import { MeshComponent, MeshComponentID } from '../../Components/Renders/MeshComponent';
import { $ref, CARD_START_DELTA, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { worldYToPositionZ } from '../../utils/positionZ';
import { TVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { worldToRenderPosition } from '../../utils/worldToRenderPosition';

export function MeshesPositionSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const entities = filterEntities(
            heap,
            (
                entity,
            ): entity is SomeEntity<
                InheritedComponent<MeshComponent> | InheritedComponent<PositionComponent>
            > => {
                return (
                    hasInheritedComponent(entity, MeshComponentID) &&
                    hasInheritedComponent(entity, PositionComponentID)
                );
            },
        );

        entities.forEach((entity) => {
            const meshes = getInheritedComponentStructs(entity, MeshComponentID);
            const position = getComponentStruct(entity, PositionComponentID);

            for (const mesh of meshes) {
                setPositionMesh(mesh, worldToRenderPosition(position, cardPosition));
            }
        });
    }
}

function setPositionMesh(struct: ExtractStruct<MeshComponent>, position: TVector): void {
    const mesh = struct[$ref];
    const delta = struct.position;

    if (mesh !== undefined) {
        mesh.position.x = (position.x + delta.x + CARD_START_DELTA.x) * TILE_SIZE;
        mesh.position.y = (position.y + delta.y + CARD_START_DELTA.y) * TILE_SIZE;
        mesh.position.z = worldYToPositionZ(mesh.position.y);
    }
}
