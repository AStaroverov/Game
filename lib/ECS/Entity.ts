import {
    $component,
    $inherited,
    ExtractInheritedTags,
    ExtractTags,
    Struct,
} from './Struct';
import { ExtractTag } from './types';

export const $entity = '__ENTITY__' as const;

export type Entity<
    Tag extends string = string,
    Comp extends Struct = Struct,
> = {
    [$entity]: Tag;
    components: Record<ExtractTag<Comp>, Comp>;
};

export type ExtractComponents<E extends Entity> = E extends Entity<any, infer C>
    ? C
    : never;

export type ExtractComponentsByShallowTag<
    S extends Struct,
    T extends ExtractTag<S>,
> = Extract<S, { [$component]: T }>;

export type ExtractComponentsByInheritedTag<
    S extends Struct,
    T extends ExtractInheritedTags<S>,
    FS extends Exclude<S, { [$inherited]: never }> = Exclude<
        S,
        { [$inherited]: never }
    >,
> = { [$inherited]: T } extends Pick<FS, typeof $inherited> ? FS : never;

export type ExtractComponentsByTag<S extends Struct, T extends ExtractTags<S>> =
    // @ts-ignore
    ExtractComponentsByShallowTag<S, T> | ExtractComponentsByInheritedTag<S, T>;

export function createEntity<Tag extends string, Comp extends Struct>(
    tag: Tag,
    components: Comp[],
): Entity<Tag, Comp> {
    return {
        [$entity]: tag,
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
    return e[$entity] === tag;
}

export function getComponent<
    E extends Entity,
    T extends ExtractTag<ExtractComponents<E>>,
>(e: E, componentTag: T): ExtractComponentsByTag<ExtractComponents<E>, T> {
    return e.components[componentTag] as ExtractComponentsByTag<
        ExtractComponents<E>,
        T
    >;
}

export function getComponentBody<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTag<C>,
>(e: E, componentTag: T): E['components'][T]['body'] {
    return getComponent(e, componentTag)['body'];
}

export function hasComponent<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTags<C>,
>(e: E, tag: T): e is E {
    return tag in e.components;
}

export function hasShallowComponent<
    E extends Entity,
    T extends ExtractTag<ExtractComponents<E>>,
>(e: E, tag: T): boolean {
    return tag in e.components;
}

export function hasInheritedComponent<
    E extends Entity,
    T extends ExtractInheritedTags<ExtractComponents<E>>,
>(e: E, tag: T): boolean {
    const components = Object.values(e.components);

    for (let i = 0; i < components.length; i++) {
        if (tag in components[i][$inherited]) {
            return true;
        }
    }

    return false;
}
