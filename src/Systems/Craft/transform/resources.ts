import { createResource } from '../../../Components/WorldResources/utils';
import { ECraftAction } from '../actions';
import { createName } from '../names';
import { TCraftResource } from '../resources';
import { mixDna, transformDna } from './dna';
import { mixFeatures, transformFeatures } from './features';

export function mixResources(
    resources: TCraftResource[],
    name: string = createName(resources, ECraftAction.Mix),
): TCraftResource {
    return createResource({
        name,
        dna: mixDna(resources.map((r) => r.dna)),
        features: mixFeatures(resources.map((r) => r.features)),
    });
}

export function transformResource(
    resource: TCraftResource,
    action: Exclude<ECraftAction, ECraftAction.Mix>,
    name: string = createName([resource], action),
): TCraftResource {
    return createResource({
        name,
        dna: transformDna(resource.dna, action),
        features: transformFeatures(resource.features, action),
    });
}
