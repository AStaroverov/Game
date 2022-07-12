import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { ECraftAction } from '../../Systems/Craft/actions';
import { TCraftResource } from '../../Systems/Craft/resources';
import { mixResources, transformResource } from '../../Systems/Craft/transform/resources';
import { getSeedResources } from './resources';

export const CraftResourcesComponentID = 'CRAFT_RESOURCES' as const;
export type CraftResourcesComponent = ReturnType<typeof createCraftResourcesComponent>;
export const createCraftResourcesComponent = () => {
    const { resourcesDna, resourcesMap } = getSeedResources();

    return createComponent(CraftResourcesComponentID, {
        resourcesDna,
        resourcesMap,
    });
};

export function createResource(
    { resourcesMap }: ExtractStruct<CraftResourcesComponent>,
    resourceNames: string[],
    action: ECraftAction,
    name?: string,
): TCraftResource {
    const resources = resourceNames.map((name) => resourcesMap[name]);
    const resource =
        action === ECraftAction.Mix
            ? mixResources(resources)
            : transformResource(resources[0], action, name);

    return (resourcesMap[resource.name] = resource);
}
