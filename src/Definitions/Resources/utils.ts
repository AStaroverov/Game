import { Assign } from '../../types';
import { getRandomId } from '../../utils/random';
import { TResource, TResourceID } from './def';
import { ESeedResourceId } from './index';

export function createResourceID() {
    return getRandomId() as TResourceID;
}

export function createResource(res: Assign<TResource, { id?: TResourceID }>) {
    return {
        id: createResourceID(),
        ...res,
    };
}

export function isRenameableResource(id: TResourceID): boolean {
    return !(id in ESeedResourceId);
}
