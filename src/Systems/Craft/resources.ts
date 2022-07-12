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

export type TCraftResource = {
    name: string;
    features: ECraftResourceFeature[];
    dna: TCraftResourceDna;
};
