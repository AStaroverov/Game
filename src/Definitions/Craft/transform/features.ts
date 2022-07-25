import { every, includes, overEvery, some } from 'lodash/fp';

import { Arr } from '../../../utils/ArrayUtils';
import { EResourceFeature } from '../../Resources/def';
import { ECraftAction } from '../index';

const FEATURE_TRANSFORMS = {
    [ECraftAction.Dry]: [
        {
            match: [EResourceFeature.Liquid, EResourceFeature.Crushed],
            replace: [EResourceFeature.Watery],
        },
        {
            match: [EResourceFeature.Wet],
            replace: [EResourceFeature.Dry],
        },
        {
            match: [EResourceFeature.Watery],
            replace: [EResourceFeature.Dry],
        },

        { match: [EResourceFeature.Elastic], replace: [EResourceFeature.Brittle] },
        { match: [EResourceFeature.Viscous], replace: [EResourceFeature.Crushed] },
        { match: [EResourceFeature.Crushed], replace: [EResourceFeature.Crushed] },
    ],
    [ECraftAction.Grind]: [
        {
            match: [EResourceFeature.Dry],
            replace: [EResourceFeature.Dry],
        },
        {
            match: [EResourceFeature.Wet],
            replace: [EResourceFeature.Wet, EResourceFeature.Viscous],
        },
        {
            match: [EResourceFeature.Watery],
            replace: [EResourceFeature.Watery],
        },
        { match: [EResourceFeature.Viscous], replace: [EResourceFeature.Viscous] },

        { match: [], replace: [EResourceFeature.Crushed] },
    ],
    [ECraftAction.Squeeze]: [
        {
            match: [EResourceFeature.Watery],
            replace: [EResourceFeature.Liquid],
        },
    ],
};

export function transformFeatures(
    features: EResourceFeature[],
    action: Exclude<ECraftAction, ECraftAction.Mix>,
): EResourceFeature[] {
    const nextFeatures: EResourceFeature[] = [];
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
        match: includes(EResourceFeature.Liquid),
        replace: (fs: EResourceFeature[]) => [EResourceFeature.Liquid],
    },
    {
        match: overEvery([
            some((f) => f === EResourceFeature.Dry),
            every(
                (f) =>
                    f !== EResourceFeature.Wet &&
                    f !== EResourceFeature.Watery &&
                    f !== EResourceFeature.Liquid,
            ),
        ]),
        replace: (fs: EResourceFeature[]) => [EResourceFeature.Dry],
    },
    {
        match: overEvery([
            some((f) => f === EResourceFeature.Wet || f === EResourceFeature.Watery),
            every((f) => f !== EResourceFeature.Dry && f !== EResourceFeature.Liquid),
        ]),
        replace: (fs: EResourceFeature[]) => [EResourceFeature.Wet],
    },
    {
        match: overEvery([
            some((f) => f === EResourceFeature.Wet || f === EResourceFeature.Watery),
            some((f) => f === EResourceFeature.Dry),
            every((f) => f !== EResourceFeature.Liquid),
        ]),
        replace: (fs: EResourceFeature[]) => [EResourceFeature.Wet, EResourceFeature.Viscous],
    },
    {
        match: includes(EResourceFeature.Viscous),
        replace: (fs: EResourceFeature[]) => [EResourceFeature.Viscous],
    },
    {
        match: includes(EResourceFeature.Crushed),
        replace: (fs: EResourceFeature[]) => [EResourceFeature.Crushed],
    },
];

export function mixFeatures(resourcesFeatures: EResourceFeature[][]): EResourceFeature[] {
    const featuresSet = resourcesFeatures.reduce((acc, features) => {
        for (const feature of features) {
            acc.add(feature);
        }

        return acc;
    }, new Set<EResourceFeature>());
    const features = Array.from(featuresSet);
    const result = [];

    for (const rule of MIX_RULES) {
        if (rule.match(features)) {
            result.push(...rule.replace(features));
        }
    }

    return Arr.uniq(result);
}
