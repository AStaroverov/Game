// import { uniq } from 'lodash';
// import { map, pipe } from 'lodash/fp';
//
// import {
//     ECraftResourceFeature,
//     MAX_CRAFT_RESOURCE_SIZE,
//     TCraftResource,
//     TCraftResourceDna,
//     TCraftResourceID,
// } from '../../Systems/Craft/resources';
// import { getRandomChar } from '../../utils/random';
// import { range } from '../../utils/range';
// import { createResource } from '../WorldResources/utils';
//
// export const ESeedDiseasesId: Record<string, TCraftResourceID> = {
//     Water: 'Water' as TCraftResourceID,
//     Lemon: 'Lemon' as TCraftResourceID,
//     Gross: 'Gross' as TCraftResourceID,
//     Garlic: 'Garlic' as TCraftResourceID,
//     CocoaBeans: 'CocoaBeans' as TCraftResourceID,
//     Carnation: 'Carnation' as TCraftResourceID,
// };
//
// const getRandomSequence = () =>
//     range(3)
//         .map(() => getRandomChar())
//         .join('');
//
// export const getSeedResources = () => {
//     const resourcesDna: TCraftResourceDna[] = pipe(
//         map(getRandomSequence),
//         uniq,
//         map((sequence) => ({ sequence, size: MAX_CRAFT_RESOURCE_SIZE })),
//     )(range(1e3));
//
//     const resourcesMap: Record<string, TCraftResource> = {
//         [ESeedResourceId.Water]: createResource({
//             id: ESeedResourceId.Water,
//             name: 'Water',
//             features: [ECraftResourceFeature.Liquid],
//             dna: {
//                 size: 0,
//                 sequence: resourcesDna[0].sequence,
//             },
//         }),
//         [ESeedResourceId.Lemon]: createResource({
//             id: ESeedResourceId.Lemon,
//             name: 'Lemon',
//             features: [ECraftResourceFeature.Watery, ECraftResourceFeature.Elastic],
//             dna: resourcesDna[1],
//         }),
//         [ESeedResourceId.Gross]: createResource({
//             id: ESeedResourceId.Gross,
//             name: 'Gross',
//             features: [ECraftResourceFeature.Wet, ECraftResourceFeature.Elastic],
//             dna: resourcesDna[2],
//         }),
//         [ESeedResourceId.Garlic]: createResource({
//             id: ESeedResourceId.Garlic,
//             name: 'Garlic',
//             features: [ECraftResourceFeature.Dry],
//             dna: resourcesDna[3],
//         }),
//         [ESeedResourceId.CocoaBeans]: createResource({
//             id: ESeedResourceId.CocoaBeans,
//             name: 'Cocoa beans',
//             features: [ECraftResourceFeature.Dry],
//             dna: resourcesDna[4],
//         }),
//         [ESeedResourceId.Carnation]: createResource({
//             id: ESeedResourceId.Carnation,
//             name: 'Carnation',
//             features: [ECraftResourceFeature.Dry, ECraftResourceFeature.Brittle],
//             dna: resourcesDna[5],
//         }),
//     };
//
//     return { resourcesDna, resourcesMap };
// };
