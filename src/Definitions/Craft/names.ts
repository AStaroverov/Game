import { TResource } from '../Resources/def';
import { ECraftAction } from './index';

const map1to2 = {
    [ECraftAction.Grind]: 'Ground',
};

export function createName(resources: TResource[], action: ECraftAction): string {
    const state =
        action in map1to2
            ? map1to2[action as ECraftAction.Grind]
            : action.endsWith('e')
            ? action + 'd'
            : action.endsWith('y')
            ? action.substring(0, action.length - 1) + 'ied'
            : action + 'ed';

    return resources.reduce((acc, resource, index) => {
        if (index === 0) return `${acc} ${resource.name}`;
        return `${acc}, ${resource.name}`;
    }, state);
}
