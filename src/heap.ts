import { createHeap, Heap } from '../lib/ECS/Heap';
import { CardEntity } from './Entities/Card';
import { DialogEntity } from './Entities/Dilog';
import { EnemyEntity } from './Entities/Enemy';
import { GlobalLightEntity } from './Entities/GlobalLight';
import { HouseEntity } from './Entities/House';
import { NpcEntity } from './Entities/NPC';
import { PlayerEntity } from './Entities/Player';
import { SettingsEntity } from './Entities/Settings';
import { WorldEntity } from './Entities/World';

export type GameHeap = Heap<
    | SettingsEntity
    | WorldEntity
    | GlobalLightEntity
    | CardEntity
    | HouseEntity
    | PlayerEntity
    | EnemyEntity
    | NpcEntity
    | DialogEntity
>;
export const createGameHeap = (seed: object = {}): GameHeap => {
    return createHeap(seed);
};
