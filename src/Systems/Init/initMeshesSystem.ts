import {
    AnyComponent,
    getStruct,
    InheritedComponent,
    isComponent,
    isInheritedComponent,
} from '../../../lib/ECS/Component';
import {
    filterComponents,
    hasInheritedComponent,
    SomeEntity,
} from '../../../lib/ECS/Entity';
import { filterEntities } from '../../../lib/ECS/Heap';
import {
    BaseMeshComponent,
    BaseMeshComponentID,
    initBaseMeshStruct,
} from '../../Components/Renders/BaseMeshComponent';
import {
    HealBarMeshComponent,
    HealBarMeshComponentID,
    initHealBarStruct,
} from '../../Components/Renders/HealBarMeshComponent';
import {
    MeshComponent,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
import { $ref } from '../../CONST';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function initMeshesSystem(heap: GameHeap, ticker: TasksScheduler) {
    ticker.addFrameInterval(update, 10);

    function update() {
        filterEntities(
            heap,
            (e): e is SomeEntity<InheritedComponent<MeshComponent>> => {
                return hasInheritedComponent(e, MeshComponentID);
            },
        ).forEach((entity) => {
            initBasicMesh(entity);
            initHealBarMesh(entity);
        });
    }
}

function initBasicMesh(
    entity: SomeEntity<AnyComponent | InheritedComponent<BaseMeshComponent>>,
) {
    filterComponents(entity, (c): c is BaseMeshComponent =>
        isInheritedComponent(c, BaseMeshComponentID),
    )
        .map(getStruct)
        .forEach((mesh) => {
            if (mesh && mesh[$ref] === undefined) {
                initBaseMeshStruct(mesh);
            }
        });
}

function initHealBarMesh(
    entity: SomeEntity<AnyComponent | HealBarMeshComponent>,
) {
    filterComponents(entity, (c): c is HealBarMeshComponent =>
        isComponent(c, HealBarMeshComponentID),
    )
        .map(getStruct)
        .forEach((healBarMesh) => {
            if (healBarMesh && healBarMesh[$ref] === undefined) {
                initHealBarStruct(healBarMesh);
            }
        });
}
