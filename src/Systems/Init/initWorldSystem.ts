import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { createWorldEntity, WorldEntityID } from '../../Entities/World';
import { GameHeap } from '../../heap';

export function initWorldSystem(heap: GameHeap): void {
    const world = getEntities(heap, WorldEntityID);

    if (world.length === 0) {
        addEntity(heap, createWorldEntity());
    }
}
