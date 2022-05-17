import {
    $component,
    $inherited,
    Component,
    ExtractStruct,
    getStruct,
} from './Component';
import { ExtractTag } from './types';

export const $entity = '__ENTITY__' as const;

export type EntityTag<Tag extends string = string> = {
    [$entity]: Tag;
};

export type EntityComponents<Comp extends Component = Component> = {
    components: Record<ExtractTag<Comp>, Comp>;
};

export type SomeEntity<Comp extends Component = Component> = Entity<'*', Comp>;

export type Entity<
    Tag extends string = string,
    Comp extends Component = Component,
> = EntityTag<Tag> & EntityComponents<Comp>;

export type ExtractComponents<E extends Entity> = E extends Entity<any, infer C>
    ? C
    : never;

export type ExtractComponentsByTag<
    S extends Component,
    T extends ExtractTag<S>,
> = Extract<S, { [$component]: T }>;

export function createEntity<Tag extends string, Comp extends Component>(
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

export function isEntity<E extends Entity, T extends ExtractTag<E>>(
    e: E,
    tag: T,
): boolean {
    return e[$entity] === tag;
}

export function hasComponent<
    C extends ExtractComponents<E>,
    E extends Entity,
    T extends ExtractTag<C>,
>(e: E, tag: T): boolean {
    return tag in e.components;
}

export function hasInheritedComponent<E extends Entity, T extends string>(
    { components }: E,
    tag: T,
): boolean {
    if (tag in components) return true;

    for (const t in components) {
        if (tag in (components[t] as any)[$inherited]) {
            return true;
        }
    }

    return false;
}

export function getComponent<
    E extends Entity,
    T extends ExtractTag<ExtractComponents<E>>,
>(e: E, tag: T): ExtractComponentsByTag<ExtractComponents<E>, T> {
    return e.components[tag] as ExtractComponentsByTag<ExtractComponents<E>, T>;
}

export function getComponentStruct<
    E extends Entity,
    T extends ExtractTag<ExtractComponents<E>>,
    C = ExtractComponentsByTag<ExtractComponents<E>, T>,
>(e: E, tag: T): ExtractStruct<C> {
    return getStruct(e.components[tag]) as ExtractStruct<C>;
}

export function tryGetComponent<S extends object>(
    e: Entity,
    tag: string,
): void | S {
    return e.components[tag] as void | S;
}

export function tryGetComponentStruct<S extends object>(
    e: Entity,
    tag: string,
): void | ExtractStruct<S> {
    return getStruct(e.components[tag]) as void | ExtractStruct<S>;
}

export function filterComponents<
    C extends Component,
    E extends Entity = Entity,
    T extends string = string,
>(entity: E, fn: (e: Component) => e is C): C[] {
    return (Object.values(entity.components) as Component[]).filter(fn) as C[];
}
