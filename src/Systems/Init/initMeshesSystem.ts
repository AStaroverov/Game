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
    HealBarMeshComponent,
    HealBarMeshComponentID,
    initHealBarStruct,
} from '../../Components/Renders/HealBarMeshComponent';
import {
    initMeshStruct,
    MeshComponent,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
import {
    MeshGroupComponent,
    MeshGroupComponentID,
} from '../../Components/Renders/MeshGroupComponent';
import { $object } from '../../CONST';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function initMeshesSystem(heap: GameHeap, ticker: TasksScheduler) {
    ticker.addFrameInterval(update, 10);

    function update() {
        filterEntities(
            heap,
            (
                e,
            ): e is
                | SomeEntity<InheritedComponent<MeshComponent>>
                | SomeEntity<InheritedComponent<MeshGroupComponent>> => {
                return (
                    hasInheritedComponent(e, MeshComponentID) ||
                    hasInheritedComponent(e, MeshGroupComponentID)
                );
            },
        ).forEach((entity) => {
            if (hasInheritedComponent(entity, MeshComponentID)) {
                initInheritedMeshes(entity);
            }

            if (hasInheritedComponent(entity, MeshGroupComponentID)) {
                initInheritedGroups(entity);
            }
        });
    }
}

function initInheritedMeshes(
    entity: SomeEntity<AnyComponent | InheritedComponent<MeshComponent>>,
) {
    filterComponents(entity, (c): c is MeshComponent =>
        isInheritedComponent(c, MeshComponentID),
    )
        .map(getStruct)
        .forEach((mesh) => {
            if (mesh && mesh[$object] === undefined) {
                initMeshStruct(mesh);
            }
        });
}

function initInheritedGroups(
    entity: SomeEntity<AnyComponent | InheritedComponent<MeshGroupComponent>>,
) {
    filterComponents(entity, (c): c is HealBarMeshComponent =>
        isComponent(c, HealBarMeshComponentID),
    )
        .map(getStruct)
        .forEach((healBarMesh) => {
            if (healBarMesh && healBarMesh[$object] === undefined) {
                initHealBarStruct(healBarMesh);
            }
        });
}
