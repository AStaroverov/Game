import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
import { TSize, TVector } from '../utils/shape';
import { TRect } from '../utils/shapes/rect';
import { structuredClone } from '../utils/structuredClone';

export const VillagesComponentID = 'VILLAGES' as const;
export type VillagesComponent = ReturnType<typeof createVillagesComponent>;

export type Village = {
    name: string;
    area: TRect;
    size: TSize;
    position: TVector;
};

export const createVillagesComponent = () =>
    createComponent(VillagesComponentID, {
        villages: [] as Village[],
    });

export function createVillage(v: Village) {
    return structuredClone(v);
}

export function setVillage({ villages }: ExtractStruct<VillagesComponent>, village: Village): void {
    const index = villages.findIndex(({ name }) => name === village.name);

    if (index !== -1) {
        Object.assign(villages[index], village);
    } else {
        villages.push(village);
    }
}

export function getVillage(
    { villages }: ExtractStruct<VillagesComponent>,
    name: string,
): undefined | Village {
    return villages.find((v) => v.name === name);
}
