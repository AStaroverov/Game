import { createEntity, getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import {
    CraftResourcesComponentID,
    createCraftResourcesComponent,
} from '../../Components/CraftResources';
import { createGameTimeComponent } from '../../Components/GameTime';
import { createPlayerStoryComponent } from '../../Components/PlayerStoryProgress';
import { GameHeap } from '../../heap';

export const WorldEntityID = 'WORLD_ENTITY' as const;
export type WorldEntity = ReturnType<typeof createWorldEntity>;
export const createWorldEntity = () =>
    createEntity(WorldEntityID, [
        createGameTimeComponent(),
        createPlayerStoryComponent(),
        createCraftResourcesComponent(),
    ]);

export function getCraftResources(gameHeap: GameHeap) {
    const world = getEntities(gameHeap, WorldEntityID)[0];
    return getComponentStruct(world, CraftResourcesComponentID);
}
