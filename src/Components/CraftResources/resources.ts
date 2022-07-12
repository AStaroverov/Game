import { uniq } from 'lodash';
import { map, pipe } from 'lodash/fp';

import {
    ECraftResourceFeature,
    MAX_CRAFT_RESOURCE_SIZE,
    TCraftResource,
    TCraftResourceDna,
} from '../../Systems/Craft/resources';
import { getRandomChar } from '../../utils/random';
import { range } from '../../utils/range';

export enum ESeedResourceName {
    Water = 'Water',
    Lemon = 'Lemon',
    Gross = 'Gross',
    Garlic = 'Garlic',
    CocoaBeans = 'Cocoa beans',
    Carnation = 'Carnation',
}

const getRandomSequence = () =>
    range(3)
        .map(() => getRandomChar())
        .join('');

export const getSeedResources = () => {
    const resourcesDna: TCraftResourceDna[] = pipe(
        map(getRandomSequence),
        uniq,
        map((sequence) => ({ sequence, size: MAX_CRAFT_RESOURCE_SIZE })),
    )(range(1e3));

    const resourcesMap: Record<string, TCraftResource> = {
        [ESeedResourceName.Water]: {
            name: 'Water',
            features: [ECraftResourceFeature.Liquid],
            dna: {
                size: 0,
                sequence: resourcesDna[0].sequence,
            },
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
