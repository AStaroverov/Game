import { enoughResources, pullResources, pushResources } from '../../Components/Backpack';
import { createWorldResource } from '../../Components/WorldResources';
import { ECraftAction, getResourcesAvailableActions } from '../../Definitions/Craft';
import { TResourceID } from '../../Definitions/Resources/def';
import { getPlayerBackpack } from '../../Entities/Player';
import { getCraftResources } from '../../Entities/World';
import { GameHeap } from '../../heap';

export function getCraftActions(heap: GameHeap, resourceNames: string[]): ECraftAction[] {
    const { resourcesMap } = getCraftResources(heap);
    const resources = resourceNames.map((name) => resourcesMap[name]);

    return getResourcesAvailableActions(resources);
}

export function craftResource(
    heap: GameHeap,
    resourceIds: TResourceID[],
    action: ECraftAction,
    name?: string,
): void {
    const backpack = getPlayerBackpack(heap);
    const craftResources = getCraftResources(heap);

    if (enoughResources(backpack, resourceIds)) {
        const resource = createWorldResource(craftResources, resourceIds, action, name);
        pullResources(backpack, ...resourceIds);
        pushResources(backpack, resource.id);
    }
}
