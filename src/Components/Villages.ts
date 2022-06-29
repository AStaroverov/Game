import { remove } from 'lodash';

import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
import { Assign } from '../types';
import { TMatrix } from '../utils/Matrix';
import { TRect } from '../utils/shapes/rect';
import { structuredClone } from '../utils/structuredClone';
import { Tile } from './Matrix/TilesMatrix/def';
import { TPerson } from './Person';

export const VillagesComponentID = 'VILLAGES' as const;
export type VillagesComponent = ReturnType<typeof createVillagesComponent>;

export type TVillage = {
    name: string;
    area: TRect;
    matrix: null | TMatrix<Tile>;
    people: TPerson[];
};

export type TVillageActive = Assign<
    TVillage,
    {
        matrix: TMatrix<Tile>;
    }
>;

export const createVillagesComponent = () =>
    createComponent(VillagesComponentID, {
        currentVillageName: undefined as undefined | string,
        villages: [] as TVillage[],
    });

export function createVillage(v: TVillage) {
    return structuredClone(v);
}

export function updateVillage(t: TVillage, s: Partial<TVillage>) {
    return Object.assign(t, s);
}

export function addVillage(
    { villages }: ExtractStruct<VillagesComponent>,
    village: TVillage,
): void {
    villages.push(village);
}

export function deleteVillage(
    { villages }: ExtractStruct<VillagesComponent>,
    name: TVillage['name'],
): void {
    remove(villages, (v) => v.name === name);
}

export function getVillage(
    { villages }: ExtractStruct<VillagesComponent>,
    name: string,
): undefined | TVillage {
    return villages.find((v) => v.name === name);
}

export function isVillageActive(v: TVillage): v is TVillageActive {
    return v.matrix !== null;
}

export const VillagesComponent = {
    create: createVillagesComponent,
    get: getVillage,
    add: addVillage,
    delete: deleteVillage,
};

export const Village = {
    create: createVillage,
    update: updateVillage,
    isActive: isVillageActive,
};
