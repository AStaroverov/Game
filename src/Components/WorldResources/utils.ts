import { TCraftResource, TCraftResourceID } from '../../Systems/Craft/resources';
import { Assign } from '../../types';
import { getRandomId } from '../../utils/random';
import { ESeedResourceId } from './resources';

export function createResourceID() {
    return getRandomId() as TCraftResourceID;
}

export function createResource(res: Assign<TCraftResource, { id?: TCraftResourceID }>) {
    return {
        id: createResourceID(),
        ...res,
    };
}

export function isRenameableResource(id: TCraftResourceID): boolean {
    return !(id in ESeedResourceId);
}
