import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { TCraftResourceID } from '../../Systems/Craft/resources';
import { ESeedResourceId } from '../CraftResources/resources';

export const BackpackComponentID = 'BACKPACK' as const;
export type BackpackComponent = ReturnType<typeof createBackpackComponent>;
export const createBackpackComponent = (props?: {
    resourcesCount: Record<TCraftResourceID, number>;
}) => {
    return createComponent(BackpackComponentID, {
        resourcesCount:
            props?.resourcesCount ??
            <Record<TCraftResourceID, number>>{
                [ESeedResourceId.Water]: 4,
                [ESeedResourceId.Lemon]: 3,
                [ESeedResourceId.Garlic]: 2,
            },
    });
};

export function enoughResources(
    { resourcesCount }: ExtractStruct<BackpackComponent>,
    ids: TCraftResourceID[],
): boolean {
    return ids.every((id) => resourcesCount[id] > 0);
}

export function pullResources(
    { resourcesCount }: ExtractStruct<BackpackComponent>,
    ...ids: TCraftResourceID[]
): void {
    ids.forEach((id) => (resourcesCount[id] -= 1));
}

export function pushResources(
    { resourcesCount }: ExtractStruct<BackpackComponent>,
    ...ids: TCraftResourceID[]
): void {
    ids.forEach((id) => {
        resourcesCount[id] = (resourcesCount[id] ?? 0) + 1;
    });
}
