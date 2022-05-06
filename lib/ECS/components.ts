export function createComponent<P extends unknown[], C extends object = object>(
    creator: (...props: P) => C,
): new (...props: P) => C {
    return class {
        constructor(...props: P) {
            Object.assign(this, creator(...props));
        }
    } as new (...props: P) => C;
}
