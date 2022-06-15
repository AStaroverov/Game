import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { createGameStoryEntity, GameStoryEntityID } from '../../Entities/GameStory';
import { GameHeap } from '../../heap';

export function initGameStorySystem(heap: GameHeap) {
    if (getEntities(heap, GameStoryEntityID).length === 0) {
        addEntity(heap, createGameStoryEntity());
    }
}
