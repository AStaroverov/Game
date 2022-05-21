import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import {
    HealBarMeshComponentID,
    initHealBarStruct,
} from '../../Components/Renders/HealBarMeshComponent';
import {
    initMeshStruct,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
import { $object } from '../../CONST';
import { EnemyEntity, EnemyEntityID } from '../../Entities/Enemy';
import { PlayerEntity, PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function initMeshesSystem(heap: GameHeap, ticker: TasksScheduler) {
    const players = getEntities(heap, PlayerEntityID);

    initMeshes(players[0]);

    ticker.addFrameInterval(update, 10);

    function update() {
        getEntities(heap, EnemyEntityID).forEach((enemy) => {
            const mesh = getComponentStruct(enemy, MeshComponentID);
            const healBarMesh = getComponentStruct(
                enemy,
                HealBarMeshComponentID,
            );

            if (mesh[$object] === undefined) {
                initMeshStruct(mesh);
            }

            if (healBarMesh[$object] === undefined) {
                initHealBarStruct(healBarMesh);
            }
        });
    }

    function initMeshes(body: EnemyEntity | PlayerEntity) {
        const mesh = getComponentStruct(body, MeshComponentID);
        const healBarMesh = getComponentStruct(body, HealBarMeshComponentID);

        if (mesh[$object] === undefined) {
            initMeshStruct(mesh);
        }

        if (healBarMesh[$object] === undefined) {
            initHealBarStruct(healBarMesh);
        }
    }
}
