import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
import { ECraftAction } from '../Definitions/Craft';
import { mixResources, transformResource } from '../Definitions/Craft/transform/resources';
import { getSeedResources } from '../Definitions/Resources';
import { TResource, TResourceID } from '../Definitions/Resources/def';
import { TSequence } from '../Definitions/Sequence/def';

export const WorldResourcesComponentID = 'WORLD_RESOURCES' as const;
export type WorldResourcesComponent = ReturnType<typeof createWorldResourcesComponent>;
export const createWorldResourcesComponent = (sequences: TSequence[]) => {
    const resourcesMap = getSeedResources(sequences);

    return createComponent(WorldResourcesComponentID, {
        resourcesMap,
    });
};

export function getResource(
    { resourcesMap }: ExtractStruct<WorldResourcesComponent>,
    id: TResourceID,
): TResource {
    return resourcesMap[id];
}

export const getResourceName = (s: ExtractStruct<WorldResourcesComponent>, r: TResourceID) =>
    getResource(s, r).name;

export function createWorldResource(
    { resourcesMap }: ExtractStruct<WorldResourcesComponent>,
    resourceNames: string[],
    action: ECraftAction,
    name?: string,
): TResource {
    const resources = resourceNames.map((name) => resourcesMap[name]);
    const resource =
        action === ECraftAction.Mix
            ? mixResources(resources)
            : transformResource(resources[0], action, name);

    return (resourcesMap[resource.id] = resource);
}

export function renameWorldResource(
    { resourcesMap }: ExtractStruct<WorldResourcesComponent>,
    id: TResourceID,
    name: string,
) {
    resourcesMap[id].name = name;
}
