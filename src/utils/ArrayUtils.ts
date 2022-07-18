import { includes, intersection, pull } from 'lodash/fp';

function multipleIncludes<T>(items: T[]) {
    const fn = intersection(items);
    return function (arr: T[]) {
        return fn(arr).length === items.length;
    };
}

function replace<T>(arr: T[], prev: T, next: T): void {
    const index = arr.indexOf(prev);

    if (index === -1) {
        arr[index] = next;
    }
}

function push<T>(arr: T[], ...items: T[]): void {
    arr.push(...items);
}

function uniq<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}

function flat<T>(arr: T[][]): T[] {
    return arr.flat();
}

export const Arr = {
    pull,
    push,
    flat,
    uniq,
    replace,
    intersection,
    includes,
    multipleIncludes,
};
