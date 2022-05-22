import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { createPlayerEntity, PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';

export function initPlayerSystem(heap: GameHeap): void {
    const players = getEntities(heap, PlayerEntityID);

    if (players.length === 0) {
        addEntity(heap, createPlayerEntity());
    }
}
