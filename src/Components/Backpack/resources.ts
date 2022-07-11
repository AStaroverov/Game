import { ECraftResourceFeature, TCraftResource } from '../../Systems/Craft/resources';
import { random } from '../../utils/random';

export enum ESeedResourceName {
    Water = 'Water',
    Lemon = 'Lemon',
    Gross = 'Gross',
    Garlic = 'Garlic',
    CocoaBeans = 'Cocoa beans',
    Carnation = 'Carnation',
}

type TDna = {
    type: 'A';
    size: 1e6;
};

export const getSeedResources = () => {
    const resourcesDna = Array(1e3)
        .fill(0)
        .map(() => random());

    const resourcesMap: Record<string, TCraftResource> = {
        [ESeedResourceName.Water]: {
            name: 'Water',
            features: [ECraftResourceFeature.Liquid],
            dna: resourcesDna[0],
        },
        [ESeedResourceName.Lemon]: {
            name: 'Lemon',
            features: [ECraftResourceFeature.Watery, ECraftResourceFeature.Elastic],
            dna: resourcesDna[1],
        },
        [ESeedResourceName.Gross]: {
            name: 'Gross',
            features: [ECraftResourceFeature.Wet, ECraftResourceFeature.Elastic],
            dna: resourcesDna[2],
        },
        [ESeedResourceName.Garlic]: {
            name: 'Garlic',
            features: [ECraftResourceFeature.Dry],
            dna: resourcesDna[3],
        },
        [ESeedResourceName.CocoaBeans]: {
            name: 'Cocoa beans',
            features: [ECraftResourceFeature.Dry],
            dna: resourcesDna[4],
        },
        [ESeedResourceName.Carnation]: {
            name: 'Carnation',
            features: [ECraftResourceFeature.Dry, ECraftResourceFeature.Brittle],
            dna: resourcesDna[5],
        },
    };

    return { resourcesDna, resourcesMap };
};
