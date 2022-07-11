import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { ECraftAction } from '../../Systems/Craft/actions';
import { TCraftResource } from '../../Systems/Craft/resources';
import { transformResources } from '../../Systems/Craft/transform/resources';
import { throwingError } from '../../utils/throwingError';
import { ESeedResourceName, getSeedResources } from './resources';

export const BackpackComponentID = 'BACKPACK' as const;
export type BackpackComponent = ReturnType<typeof createBackpackComponent>;
export const createBackpackComponent = (props?: { resourcesCount: Record<string, number> }) => {
    const { resourcesDna, resourcesMap } = getSeedResources();

    return createComponent(BackpackComponentID, {
        resourcesDna,
        resourcesMap,
        resourcesCount: props?.resourcesCount ?? {
            [ESeedResourceName.Water]: 4,
            [ESeedResourceName.Lemon]: 3,
            [ESeedResourceName.Garlic]: 2,
        },
    });
};

export function craftResource(
    backpack: ExtractStruct<BackpackComponent>,
    resources: TCraftResource[],
    action: ECraftAction,
    name?: string,
): void {
    if (!resourcesEnough(backpack, resources)) {
        throwingError('Not enough resources in Backpack');
    }

    pullResources(backpack, ...resources);
    pushResources(backpack, transformResources(resources, action, name));
}

export function resourcesEnough(
    backpack: ExtractStruct<BackpackComponent>,
    resources: TCraftResource[],
): boolean {
    return resources.every((resource) => backpack.resourcesCount[resource.name] > 0);
}

export function pullResources(
    backpack: ExtractStruct<BackpackComponent>,
    ...resources: TCraftResource[]
): void {
    resources.forEach((resource) => (backpack.resourcesCount[resource.name] -= 1));
}

export function pushResources(
    { resourcesMap, resourcesCount }: ExtractStruct<BackpackComponent>,
    ...resources: TCraftResource[]
): void {
    resources.forEach((resource) => {
        resourcesMap[resource.name] = resource;
        resourcesCount[resource.name] = (resourcesCount[resource.name] ?? 0) + 1;
    });
}
