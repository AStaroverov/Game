import { negate, overSome } from 'lodash';
import { every, includes, map, overEvery, pipe, some } from 'lodash/fp';

import { ECraftResourceFeature, TCraftResource } from '../../Components/WorldResources/def';

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
                includes(ECraftResourceFeature.Dry),
                includes(ECraftResourceFeature.Wet),
                includes(ECraftResourceFeature.Watery),
            ]),
            negate(includes(ECraftResourceFeature.Crushed)),
        ]),
        replace: () => [ECraftAction.Grind],
    },
    {
        match: includes(ECraftResourceFeature.Wet),
        replace: () => [ECraftAction.Dry],
    },
    {
        match: includes(ECraftResourceFeature.Watery),
        replace: () => [ECraftAction.Dry, ECraftAction.Squeeze],
    },
];

export function getFeaturesAvailableActions(features: ECraftResourceFeature[]): ECraftAction[] {
    return AVAILABLE_ACTIONS.reduce((acc, { match, replace }) => {
        if (match(features)) acc.push(...replace());
        return acc;
    }, [] as ECraftAction[]);
}

const canBeMixed = pipe(
    map((r: TCraftResource) => r.features),
    overSome([
        some(includes(ECraftResourceFeature.Liquid)),
        every(includes(ECraftResourceFeature.Crushed)),
    ]),
);

export function getResourcesAvailableActions(resources: TCraftResource[]): ECraftAction[] {
    return resources.length === 0
        ? []
        : resources.length === 1
        ? getFeaturesAvailableActions(resources[0].features)
        : canBeMixed(resources)
        ? [ECraftAction.Mix]
        : [];
}
