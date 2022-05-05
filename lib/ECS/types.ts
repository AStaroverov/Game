export type Ref = (...args: unknown[]) => unknown;
export type Component<P = unknown> = { ref: Ref; payload: P };
export type CreateComponent<
    P extends unknown[] = unknown[],
    C extends Component = Component,
> = (...props: P) => C;

export type Entity<C extends Component = Component> = {
    ref: Ref;
    map: Map<C['ref'], C>;
};
export type CreateEntity<
    P extends unknown[] = unknown[],
    E extends Entity = Entity,
> = (...props: P) => E;
