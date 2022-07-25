import { negate, overSome } from 'lodash';
import { every, includes, map, overEvery, pipe, some } from 'lodash/fp';

import { EResourceFeature, TResource } from '../Resources/def';

export enum ECraftAction {
    Mix = 'Mix',
    Dry = 'Dry',
    Grind = 'Grind',
    Squeeze = 'Squeeze',
}

const AVAILABLE_ACTIONS = [
    {
        match: overEvery([
            overSome([
                includes(EResourceFeature.Dry),
                includes(EResourceFeature.Wet),
                includes(EResourceFeature.Watery),
            ]),
            negate(includes(EResourceFeature.Crushed)),
        ]),
        replace: () => [ECraftAction.Grind],
    },
    {
        match: includes(EResourceFeature.Wet),
        replace: () => [ECraftAction.Dry],
    },
    {
        match: includes(EResourceFeature.Watery),
        replace: () => [ECraftAction.Dry, ECraftAction.Squeeze],
    },
];

export function getFeaturesAvailableActions(features: EResourceFeature[]): ECraftAction[] {
    return AVAILABLE_ACTIONS.reduce((acc, { match, replace }) => {
        if (match(features)) acc.push(...replace());
        return acc;
    }, [] as ECraftAction[]);
}

const canBeMixed = pipe(
    map((r: TResource) => r.features),
    overSome([some(includes(EResourceFeature.Liquid)), every(includes(EResourceFeature.Crushed))]),
);

export function getResourcesAvailableActions(resources: TResource[]): ECraftAction[] {
    return resources.length === 0
        ? []
        : resources.length === 1
        ? getFeaturesAvailableActions(resources[0].features)
        : canBeMixed(resources)
        ? [ECraftAction.Mix]
        : [];
}
