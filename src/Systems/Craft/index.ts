import { enoughResources, pullResources, pushResources } from '../../Components/Backpack';
import { createResource } from '../../Components/CraftResources';
import { getPlayerBackpack } from '../../Entities/Player';
import { getCraftResources } from '../../Entities/World';
import { GameHeap } from '../../heap';
import { ECraftAction, getResourcesAvailableActions } from './actions';

export function getCraftActions(heap: GameHeap, resourceNames: string[]): ECraftAction[] {
    const { resourcesMap } = getCraftResources(heap);
    const resources = resourceNames.map((name) => resourcesMap[name]);

    return getResourcesAvailableActions(resources);
}

export function craftResource(
    heap: GameHeap,
    resourceNames: string[],
    action: ECraftAction,
    name?: string,
): void {
    const backpack = getPlayerBackpack(heap);
    const craftResources = getCraftResources(heap);

    if (enoughResources(backpack, resourceNames)) {
        const resource = createResource(craftResources, resourceNames, action, name);
        pullResources(backpack, ...resourceNames);
        pushResources(backpack, resource.name);
    }
}
