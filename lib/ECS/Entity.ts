import {
    $component,
    $inherited,
    Component,
    ComponentInherited,
    ComponentTag,
    ExtractStruct,
    ExtractTags,
    getStruct,
} from './Component';
import { ExtractTag } from './types';

export const $entity = '__ENTITY__' as const;

export type EntityTag<Tag extends unknown | string = string> = {
    [$entity]: Tag;
};

export type EntityComponents<
    Comp extends Component<any, any, any> = Component<any, any, any>,
> = {
    components: Comp; // Record<ExtractTag<Comp>, Comp>;
};

export type Entity<
    Tag extends unknown | string = string,
    Comp extends Component<any, any, any> = Component<any, any, any>,
> = EntityTag<Tag> & EntityComponents<Comp>;

export type SomeEntity<
    Comp extends Component<any, any, any> = Component<any, any, any>,
> = Entity<any, Comp>;

export type ExtractComponents<E extends Entity> = E extends Entity<any, infer C>
    ? C
    : never;

export type ExtractComponentsByTag<
    C extends Component<any, any, any>,
    T extends ExtractTag<C>,
> = Extract<C, ComponentTag<T>>;

export type ExtractComponentsByTags<
    C extends Component<any, any, any>,
    T extends ExtractTags<C>,
> = Extract<C, ComponentTag<T>> | Extract<C, ComponentInherited<T>>;

export function createEntity<
    Tag extends string,
    Comp extends Component<any, any, any>,
>(tag: Tag, components: Comp[]): Entity<Tag, Comp> {
    return {
        [$entity]: tag,
        components: components.reduce((acc, component) => {
            // @ts-ignore
            acc[component[$component]] = component;
            return acc;
        }, {} as Comp),
    };
}

export function isEntity<E extends Entity, T extends ExtractTag<E>>(
    e: E,
    tag: T,
): boolean {
    return e[$entity] === tag;
}

export function hasComponent<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTag<C>,
>(e: E, tag: T): boolean {
    return tag in e.components;
}

export function hasInheritedComponent<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTags<C>,
>(e: E, tag: T): boolean {
    if (tag in e.components) return true;

    for (const t in e.components) {
        if (tag in __getEntityComponent(e, t)[$inherited]) {
            return true;
        }
    }

    return false;
}
export function getComponent<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTag<C>,
>(e: E, tag: T): ExtractComponentsByTag<C, T> {
    return __getEntityComponent(e, tag) as ExtractComponentsByTag<C, T>;
}

export function getInheritedComponents<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTags<C>,
>(e: E, tag: T): ExtractComponentsByTags<C, T>[] {
    const resultComponents = [];

    for (const t in __getEntityComponents(e)) {
        const component = __getEntityComponent(e, t) as C;

        if (component[$component] === tag || tag in component[$inherited]) {
            resultComponents.push(component);
        }
    }

    return resultComponents as ExtractComponentsByTags<C, T>[];
}

export function getInheritedComponentStructs<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTags<C>,
>(e: E, tag: T): ExtractStruct<ExtractComponentsByTags<C, T>>[] {
    return getInheritedComponents(e, tag).map(getStruct) as ExtractStruct<
        ExtractComponentsByTags<C, T>
    >[];
}

export function getComponentStruct<
    E extends Entity,
    T extends ExtractTag<ExtractComponents<E>>,
    C = ExtractComponentsByTag<ExtractComponents<E>, T>,
>(e: E, tag: T): ExtractStruct<C> {
    return getStruct(__getEntityComponent(e, tag)) as ExtractStruct<C>;
}

export function tryGetComponent<S extends object>(
    e: Entity,
    tag: string,
): void | S {
    return __getEntityComponents(e)[tag] as void | S;
}

export function tryGetComponentStruct<S extends object>(
    e: Entity,
    tag: string,
): void | ExtractStruct<S> {
    const comp = __getEntityComponent(e, tag);
    return (comp && getStruct(comp)) as void | ExtractStruct<S>;
}

export function filterComponents<
    E extends Entity,
    C extends ExtractComponents<E>,
    T extends ExtractTag<C>,
    R extends C,
>(e: E, fn: (c: C) => c is R): R[] {
    return (Object.values(__getEntityComponents(e)) as C[]).filter(fn) as R[];
}

function __getEntityComponents(e: any): Record<any, Component<any, any, any>> {
    return e.components as any;
}

function __getEntityComponent(e: any, t: any): Component<any, any, any> {
    return __getEntityComponents(e)[t] as any;
}
