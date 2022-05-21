import { createHeap, Heap } from '../lib/ECS/Heap';
import { CardEntity } from './Entities/Card';
import { EnemyEntity } from './Entities/Enemy';
import { GlobalLightEntity } from './Entities/GlobalLight';
import { PlayerEntity } from './Entities/Player';
import { WorldEntity } from './Entities/World';

export type GameHeap = Heap<
    GlobalLightEntity | WorldEntity | CardEntity | PlayerEntity | EnemyEntity
>;
export const createGameHeap = (seed: object = {}): GameHeap => {
    return createHeap(seed);
};
