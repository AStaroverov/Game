import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { ECraftAction } from '../../Systems/Craft/actions';
import { mixResources, transformResource } from '../../Systems/Craft/transform/resources';
import { TCraftResource, TCraftResourceID } from './def';
import { getSeedResources } from './resources';

export const WorldResourcesComponentID = 'WORLD_RESOURCES' as const;
export type WorldResourcesComponent = ReturnType<typeof createWorldResourcesComponent>;
export const createWorldResourcesComponent = () => {
    const { resourcesDna, resourcesMap } = getSeedResources();

    return createComponent(WorldResourcesComponentID, {
        resourcesDna,
        resourcesMap,
    });
};

export function getResource(
    { resourcesMap }: ExtractStruct<WorldResourcesComponent>,
    id: TCraftResourceID,
): TCraftResource {
    return resourcesMap[id];
}

export const getResourceName = (a: ExtractStruct<WorldResourcesComponent>, b: TCraftResourceID) =>
    getResource(a, b).name;

export function createWorldResource(
    { resourcesMap }: ExtractStruct<WorldResourcesComponent>,
    resourceNames: string[],
    action: ECraftAction,
    name?: string,
): TCraftResource {
    const resources = resourceNames.map((name) => resourcesMap[name]);
    const resource =
        action === ECraftAction.Mix
            ? mixResources(resources)
            : transformResource(resources[0], action, name);

    return (resourcesMap[resource.id] = resource);
}

export function renameWorldResource(
    { resourcesMap }: ExtractStruct<WorldResourcesComponent>,
    id: TCraftResourceID,
    name: string,
) {
    resourcesMap[id].name = name;
}
