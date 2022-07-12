import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { ESeedResourceName } from '../CraftResources/resources';

export const BackpackComponentID = 'BACKPACK' as const;
export type BackpackComponent = ReturnType<typeof createBackpackComponent>;
export const createBackpackComponent = (props?: { resourcesCount: Record<string, number> }) => {
    return createComponent(BackpackComponentID, {
        resourcesCount: props?.resourcesCount ?? {
            [ESeedResourceName.Water]: 4,
            [ESeedResourceName.Lemon]: 3,
            [ESeedResourceName.Garlic]: 2,
        },
    });
};

export function enoughResources(
    { resourcesCount }: ExtractStruct<BackpackComponent>,
    names: string[],
): boolean {
    return names.every((name) => resourcesCount[name] > 0);
}

export function pullResources(
    { resourcesCount }: ExtractStruct<BackpackComponent>,
    ...resources: string[]
): void {
    resources.forEach((name) => (resourcesCount[name] -= 1));
}

export function pushResources(
    { resourcesCount }: ExtractStruct<BackpackComponent>,
    ...resources: string[]
): void {
    resources.forEach((name) => {
        resourcesCount[name] = (resourcesCount[name] ?? 0) + 1;
    });
}
