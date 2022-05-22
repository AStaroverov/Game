import { createHeap, Heap } from '../lib/ECS/Heap';
import { CardEntity } from './Entities/Card';
import { DialogEntity } from './Entities/Dilog';
import { EnemyEntity } from './Entities/Enemy';
import { GameStoryEntity } from './Entities/GameStory';
import { GlobalLightEntity } from './Entities/GlobalLight';
import { NpcEntity } from './Entities/NPC';
import { PlayerEntity } from './Entities/Player';
import { WorldEntity } from './Entities/World';

export type GameHeap = Heap<
    | GlobalLightEntity
    | WorldEntity
    | GameStoryEntity
    | CardEntity
    | PlayerEntity
    | EnemyEntity
    | NpcEntity
    | DialogEntity
>;
export const createGameHeap = (seed: object = {}): GameHeap => {
    return createHeap(seed);
};
