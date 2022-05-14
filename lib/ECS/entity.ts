import { $tag as $component, Component } from './component';
import { ExtractTag } from './types';

export const $tag = '__ENTITY__' as const;

export type Entity<
    Tag extends string = string,
    Comp extends Component = Component,
> = {
    [$tag]: Tag;
    components: Record<ExtractTag<Comp>, Comp>;
};

export type ExtractComponents<E extends Entity> = E extends Entity<any, infer C>
    ? C
    : never;
export type ExtractComponentsByTag<
    C extends Component,
    T extends string,
> = C extends Component<T> ? C : never;

export function createEntity<
    Tag extends string = string,
    Comp extends Component = Component,
>(tag: Tag, components: Comp[]): Entity<Tag, Comp> {
    return {
        [$tag]: tag,
        components: components.reduce((acc, component) => {
            // @ts-ignore
            acc[component[$component]] = component;
            return acc;
        }, {} as Record<ExtractTag<Comp>, Comp>),
    };
}

export function isEntity<T extends string, E extends Entity<T>>(
    e: E,
    tag: T,
): e is E {
    return e[$tag] === tag;
}

export function getComponent<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTag<C>,
>(e: E, componentTag: T): ExtractComponentsByTag<C, T> {
    return e.components[componentTag] as ExtractComponentsByTag<C, T>;
}

export function hasComponent<
    E extends Entity,
    T extends ExtractTag<ExtractComponents<E>>,
>(e: E, tag: T): boolean {
    return tag in e.components;
}