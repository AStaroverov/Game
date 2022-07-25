import { TSequence } from '../Sequence/def';
import { EResourceFeature, TResource, TResourceID } from './def';
import { createResource } from './utils';

export const ESeedResourceId: Record<string, TResourceID> = {
    Water: 'Water' as TResourceID,
    Lemon: 'Lemon' as TResourceID,
    Gross: 'Gross' as TResourceID,
    Garlic: 'Garlic' as TResourceID,
    CocoaBeans: 'CocoaBeans' as TResourceID,
    Carnation: 'Carnation' as TResourceID,
};

export const getSeedResources = (sequences: TSequence[]) => {
    return <Record<string, TResource>>{
        [ESeedResourceId.Water]: createResource({
            id: ESeedResourceId.Water,
            name: 'Water',
            features: [EResourceFeature.Liquid],
            sequence: sequences[0],
        }),
        [ESeedResourceId.Lemon]: createResource({
            id: ESeedResourceId.Lemon,
            name: 'Lemon',
            features: [EResourceFeature.Watery, EResourceFeature.Elastic],
            sequence: sequences[1],
        }),
        [ESeedResourceId.Gross]: createResource({
            id: ESeedResourceId.Gross,
            name: 'Gross',
            features: [EResourceFeature.Wet, EResourceFeature.Elastic],
            sequence: sequences[2],
        }),
        [ESeedResourceId.Garlic]: createResource({
            id: ESeedResourceId.Garlic,
            name: 'Garlic',
            features: [EResourceFeature.Dry],
            sequence: sequences[3],
        }),
        [ESeedResourceId.CocoaBeans]: createResource({
            id: ESeedResourceId.CocoaBeans,
            name: 'Cocoa beans',
            features: [EResourceFeature.Dry],
            sequence: sequences[4],
        }),
        [ESeedResourceId.Carnation]: createResource({
            id: ESeedResourceId.Carnation,
            name: 'Carnation',
            features: [EResourceFeature.Dry, EResourceFeature.Brittle],
            sequence: sequences[5],
        }),
    };
};
