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

export type TCraftResource = {
    name: string;
    features: ECraftResourceFeature[];
    dna: number;
};
