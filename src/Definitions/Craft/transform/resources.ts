import { TResource } from '../../Resources/def';
import { createResource } from '../../Resources/utils';
import { mixSequences, transformSequence } from '../../Sequence';
import { ECraftAction } from '../index';
import { createName } from '../names';
import { mixFeatures, transformFeatures } from './features';

export function mixResources(
    resources: TResource[],
    name: string = createName(resources, ECraftAction.Mix),
): TResource {
    return createResource({
        name,
        sequence: mixSequences(resources.map((r) => r.sequence)),
        features: mixFeatures(resources.map((r) => r.features)),
    });
}

export function transformResource(
    resource: TResource,
    action: Exclude<ECraftAction, ECraftAction.Mix>,
    name: string = createName([resource], action),
): TResource {
    return createResource({
        name,
        sequence: transformSequence(resource.sequence, action),
        features: transformFeatures(resource.features, action),
    });
}
