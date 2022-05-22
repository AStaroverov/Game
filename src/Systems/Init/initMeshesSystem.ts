import {
    getStruct,
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
                | SomeEntity<MeshComponent>
                | SomeEntity<MeshGroupComponent> => {
                return (
                    hasInheritedComponent(e, MeshComponentID) ||
                    hasInheritedComponent(e, MeshGroupComponentID)
                );
            },
        ).forEach((entity) => {
            if (hasInheritedComponent<MeshComponent>(entity, MeshComponentID)) {
                initInheritedMeshes(entity);
            }

            if (
                hasInheritedComponent<MeshGroupComponent>(
                    entity,
                    MeshGroupComponentID,
                )
            ) {
                initInheritedGroups(entity);
            }
        });
    }
}

function initInheritedMeshes(entity: SomeEntity<MeshComponent>) {
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

function initInheritedGroups(entity: SomeEntity<MeshGroupComponent>) {
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
