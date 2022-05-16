import { createHeap as create } from '../lib/ECS/Heap';
import { createCardEntity } from './Entities/Card';
import { createEnemyEntity } from './Entities/Enemy';
import { createGlobalLightEntity } from './Entities/GlobalLight';
import { createPlayerEntity } from './Entities/Player';
import { createWorldEntity } from './Entities/World';

export type GameHeap = ReturnType<typeof createGameHeap>;
export const createGameHeap = () =>
    create([
        createGlobalLightEntity,
        createWorldEntity,
        createCardEntity,
        createPlayerEntity,
        createEnemyEntity,
    ]);
