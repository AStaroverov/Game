import { enoughResources, pullResources, pushResources } from '../../Components/Backpack';
import { createCraftResource } from '../../Components/CraftResources';
import { getPlayerBackpack } from '../../Entities/Player';
import { getCraftResources } from '../../Entities/World';
import { GameHeap } from '../../heap';
import { ECraftAction, getResourcesAvailableActions } from './actions';
import { TCraftResourceID } from './resources';

export function getCraftActions(heap: GameHeap, resourceNames: string[]): ECraftAction[] {
    const { resourcesMap } = getCraftResources(heap);
    const resources = resourceNames.map((name) => resourcesMap[name]);

    return getResourcesAvailableActions(resources);
}

export function craftResource(
    heap: GameHeap,
    resourceIds: TCraftResourceID[],
    action: ECraftAction,
    name?: string,
): void {
    const backpack = getPlayerBackpack(heap);
    const craftResources = getCraftResources(heap);

    if (enoughResources(backpack, resourceIds)) {
        const resource = createCraftResource(craftResources, resourceIds, action, name);
        pullResources(backpack, ...resourceIds);
        pushResources(backpack, resource.id);
    }
}
