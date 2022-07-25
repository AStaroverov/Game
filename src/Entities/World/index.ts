import { createEntity, getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { createGameTimeComponent } from '../../Components/GameTime';
import { createPlayerStoryComponent } from '../../Components/PlayerStoryProgress';
import { createWorldDiseasesComponent } from '../../Components/WorldDiseases';
import {
    createWorldResourcesComponent,
    WorldResourcesComponentID,
} from '../../Components/WorldResources';
import { getRandomSequences } from '../../Definitions/Sequence';
import { GameHeap } from '../../heap';

export const WorldEntityID = 'WORLD_ENTITY' as const;
export type WorldEntity = ReturnType<typeof createWorldEntity>;
export const createWorldEntity = () => {
    const sequences = getRandomSequences(100);

    return createEntity(WorldEntityID, [
        createGameTimeComponent(),
        createPlayerStoryComponent(),
        createWorldDiseasesComponent(sequences),
        createWorldResourcesComponent(sequences),
    ]);
};

export function getCraftResources(gameHeap: GameHeap) {
    const world = getEntities(gameHeap, WorldEntityID)[0];
    return getComponentStruct(world, WorldResourcesComponentID);
}
