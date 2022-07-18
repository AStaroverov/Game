import { ECraftAction } from './actions';
import { TCraftResource } from './resources';

const map1to2 = {
    [ECraftAction.Grind]: 'Ground',
};

export function createName(resources: TCraftResource[], action: ECraftAction): string {
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
