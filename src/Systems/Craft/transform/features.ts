import { every, includes, overEvery, some } from 'lodash/fp';

import { ECraftResourceFeature } from '../../../Components/WorldResources/def';
import { Arr } from '../../../utils/ArrayUtils';
import { ECraftAction } from '../actions';

const FEATURE_TRANSFORMS = {
    [ECraftAction.Dry]: [
        {
            match: [ECraftResourceFeature.Liquid, ECraftResourceFeature.Crushed],
            replace: [ECraftResourceFeature.Watery],
        },
        {
            match: [ECraftResourceFeature.Wet],
            replace: [ECraftResourceFeature.Dry],
        },
        {
            match: [ECraftResourceFeature.Watery],
            replace: [ECraftResourceFeature.Dry],
        },

        { match: [ECraftResourceFeature.Elastic], replace: [ECraftResourceFeature.Brittle] },
        { match: [ECraftResourceFeature.Viscous], replace: [ECraftResourceFeature.Crushed] },
        { match: [ECraftResourceFeature.Crushed], replace: [ECraftResourceFeature.Crushed] },
    ],
    [ECraftAction.Grind]: [
        {
            match: [ECraftResourceFeature.Dry],
            replace: [ECraftResourceFeature.Dry],
        },
        {
            match: [ECraftResourceFeature.Wet],
            replace: [ECraftResourceFeature.Wet, ECraftResourceFeature.Viscous],
        },
        {
            match: [ECraftResourceFeature.Watery],
            replace: [ECraftResourceFeature.Watery],
        },
        { match: [ECraftResourceFeature.Viscous], replace: [ECraftResourceFeature.Viscous] },

        { match: [], replace: [ECraftResourceFeature.Crushed] },
    ],
    [ECraftAction.Squeeze]: [
        {
            match: [ECraftResourceFeature.Watery],
            replace: [ECraftResourceFeature.Liquid],
        },
    ],
};

export function transformFeatures(
    features: ECraftResourceFeature[],
    action: Exclude<ECraftAction, ECraftAction.Mix>,
): ECraftResourceFeature[] {
    const nextFeatures: ECraftResourceFeature[] = [];
    const actionTransforms = FEATURE_TRANSFORMS[action];

    for (const { match, replace } of actionTransforms) {
        if (Arr.multipleIncludes(match)(features)) {
            Arr.push(nextFeatures, ...replace);
        }
    }

    return Arr.uniq(nextFeatures);
}

const MIX_RULES = [
    {
        match: includes(ECraftResourceFeature.Liquid),
        replace: (fs: ECraftResourceFeature[]) => [ECraftResourceFeature.Liquid],
    },
    {
        match: overEvery([
            some((f) => f === ECraftResourceFeature.Dry),
            every(
                (f) =>
                    f !== ECraftResourceFeature.Wet &&
                    f !== ECraftResourceFeature.Watery &&
                    f !== ECraftResourceFeature.Liquid,
            ),
        ]),
        replace: (fs: ECraftResourceFeature[]) => [ECraftResourceFeature.Dry],
    },
    {
        match: overEvery([
            some((f) => f === ECraftResourceFeature.Wet || f === ECraftResourceFeature.Watery),
            every((f) => f !== ECraftResourceFeature.Dry && f !== ECraftResourceFeature.Liquid),
        ]),
        replace: (fs: ECraftResourceFeature[]) => [ECraftResourceFeature.Wet],
    },
    {
        match: overEvery([
            some((f) => f === ECraftResourceFeature.Wet || f === ECraftResourceFeature.Watery),
            some((f) => f === ECraftResourceFeature.Dry),
            every((f) => f !== ECraftResourceFeature.Liquid),
        ]),
        replace: (fs: ECraftResourceFeature[]) => [
            ECraftResourceFeature.Wet,
            ECraftResourceFeature.Viscous,
        ],
    },
    {
        match: includes(ECraftResourceFeature.Viscous),
        replace: (fs: ECraftResourceFeature[]) => [ECraftResourceFeature.Viscous],
    },
    {
        match: includes(ECraftResourceFeature.Crushed),
        replace: (fs: ECraftResourceFeature[]) => [ECraftResourceFeature.Crushed],
    },
];

export function mixFeatures(resourcesFeatures: ECraftResourceFeature[][]): ECraftResourceFeature[] {
    const featuresSet = resourcesFeatures.reduce((acc, features) => {
        for (const feature of features) {
            acc.add(feature);
        }

        return acc;
    }, new Set<ECraftResourceFeature>());
    const features = Array.from(featuresSet);
    const result = [];

    for (const rule of MIX_RULES) {
        if (rule.match(features)) {
            result.push(...rule.replace(features));
        }
    }

    return Arr.uniq(result);
}
