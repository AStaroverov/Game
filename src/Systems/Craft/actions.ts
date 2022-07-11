import { every, flatten, includes, intersection, map, pipe } from 'lodash/fp';

import { ECraftResourceFeature, TCraftResource } from './resources';

export enum ECraftAction {
    Mix = 'Mix',
    Dry = 'Dry',
    Grind = 'Grind',
    Squeeze = 'Squeeze',
}

export const ALL_CRAFT_ACTIONS = [ECraftAction.Mix, ECraftAction.Grind, ECraftAction.Squeeze];

const availableActions = [
    {
        match: includes(ECraftResourceFeature.Dry),
        replace: () => [ECraftAction.Grind],
    },
    {
        match: includes(ECraftResourceFeature.Wet),
        replace: () => [ECraftAction.Dry, ECraftAction.Grind],
    },
    {
        match: includes(ECraftResourceFeature.Watery),
        replace: () => [ECraftAction.Dry, ECraftAction.Grind, ECraftAction.Squeeze],
    },
    {
        match: every(includes(ECraftResourceFeature.Crushed)),
        replace: () => [ECraftAction.Mix],
    },
];

export function getFeaturesAvailableActions(features: ECraftResourceFeature[]): ECraftAction[] {
    return availableActions.reduce((acc, { match, replace }) => {
        if (match(features)) acc.push(...replace());
        return acc;
    }, [] as ECraftAction[]);
}

const isSomeResourceLiquid = pipe(
    map((r: TCraftResource) => r.features),
    flatten,
    includes(ECraftResourceFeature.Liquid),
);

export function getResourcesAvailableActions(resources: TCraftResource[]): ECraftAction[] {
    return isSomeResourceLiquid(resources) && resources.length > 1
        ? [ECraftAction.Mix]
        : resources.length === 0
        ? []
        : resources
              .map((resource) => getFeaturesAvailableActions(resource.features))
              .reduce((acc, features) => intersection(features)(acc), ALL_CRAFT_ACTIONS);
}
