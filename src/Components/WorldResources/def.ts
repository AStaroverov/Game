import { Opaque } from '../../types';

export enum ECraftResourceFeature {
    Dry = 'Dry',
    Wet = 'Wet',
    Watery = 'Watery',
    Liquid = 'Liquid',

    Viscous = 'Viscous',
    Elastic = 'Elastic',
    Brittle = 'Brittle',
    Crushed = 'Crushed',
}

export const MAX_CRAFT_RESOURCE_SIZE = 100;

export type TCraftResourceDna = {
    size: number;
    sequence: string;
};

export type TCraftResourceID = Opaque<'CraftResource', string>;

export type TCraftResource = {
    id: TCraftResourceID;
    dna: TCraftResourceDna;
    name: string;
    features: ECraftResourceFeature[];
};
