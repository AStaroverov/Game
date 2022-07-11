import { Arr } from '../../../utils/ArrayUtils';
import { ECraftAction } from '../actions';
import { createName } from '../names';
import { TCraftResource } from '../resources';
import { mixFeatures, transformFeatures } from './features';

export function transformResources(
    resources: TCraftResource[],
    action: ECraftAction,
    name: string = createName(resources, action),
): TCraftResource {
    const transformedResources =
        action === ECraftAction.Mix
            ? resources
            : resources.map((r) => transformResource(r, action, '__transformResources__'));
    const transformedFeatures = transformedResources.map(({ features }) => features);

    return {
        dna: resources[0].dna,
        name,
        features:
            transformedFeatures.length === 1
                ? Arr.flat(transformedFeatures)
                : mixFeatures(transformedFeatures),
    };
}

export function transformResource(
    resource: TCraftResource,
    action: Exclude<ECraftAction, ECraftAction.Mix>,
    name: string = createName([resource], action),
): TCraftResource {
    return {
        dna: resource.dna,
        name,
        features: transformFeatures(resource.features, action),
    };
}
