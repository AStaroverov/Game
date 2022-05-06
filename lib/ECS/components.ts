interface IComponent<P extends unknown, C extends object = object> {
    new (props: P): C;
}

export function createComponent<P extends unknown, C extends object = object>(
    creator: (props: P) => C,
): IComponent<P, C> {
    return class {
        constructor(props: P) {
            Object.assign(this, creator(props));
        }
    } as IComponent<P, C>;
}

export class Component<P> {
    constructor(public payload: P) {}
}
