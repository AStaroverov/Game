import {
    $entity as $entity,
    Entity,
    ExtractComponents,
    ExtractComponentsByInheritedTag,
    ExtractComponentsByShallowTag,
    ExtractComponentsByTag,
} from './Entity';
import { ExtractInheritedTags, ExtractTags } from './Struct';
import { ExtractTag } from './types';

const EMPTY_ARRAY: any[] = [];

export type Heap<E extends Entity = Entity> = {
    entities: Record<ExtractTag<E>, E[]>;
};

export type ExtractEntity<H> = H extends Heap<infer E> ? E : never;

export type ExtractEntitiesByTag<E, T extends string> = E extends Entity<T>
    ? E
    : never;

export type ExtractEntitiesByComponent<
    E extends Entity,
    C extends ExtractComponents<E>,
> = Extract<Entity<any, C>, E>;

export type ExtractEntitiesByComponentTag<
    E extends Entity,
    T extends ExtractTags<ExtractComponents<E>>,
    C extends ExtractComponents<E> = ExtractComponents<E>,
    DC extends ExtractComponentsByTag<C, T> = ExtractComponentsByTag<C, T>,
> = DC extends never ? never : Extract<Entity<any, DC>, E>;

export type ExtractEntitiesByComponentShallowTag<
    E extends Entity,
    T extends ExtractTag<ExtractComponents<E>>,
    C extends ExtractComponents<E> = ExtractComponents<E>,
    DC extends ExtractComponentsByShallowTag<
        C,
        T
    > = ExtractComponentsByShallowTag<C, T>,
> = DC extends never ? never : Extract<Entity<any, DC>, E>;

export type ExtractEntitiesByComponentInheritedTag<
    E extends Entity,
    T extends ExtractInheritedTags<ExtractComponents<E>>,
    C extends ExtractComponents<E> = ExtractComponents<E>,
    DC extends ExtractComponentsByInheritedTag<
        C,
        T
    > = ExtractComponentsByInheritedTag<C, T>,
> = DC extends never ? never : Extract<Entity<any, DC>, E>;

export function createHeap<
    EC extends (...args: any[]) => Entity = (...args: any[]) => Entity,
>(Entities: EC[]): Heap<ReturnType<EC>> {
    const entities = {};

    return { entities } as Heap<ReturnType<EC>>;
}

export function registerEntity<H extends Heap>(
    heap: H,
    entity: ExtractEntity<H>,
): void {
    if (heap.entities[entity[$entity]] === undefined) {
        heap.entities[entity[$entity]] = [];
    }

    heap.entities[entity[$entity]].push(entity);
}

export function unregisterEntity<H extends Heap>(
    heap: H,
    entity: ExtractEntity<H>,
): void {
    const arr = heap.entities[entity[$entity]];
    const index = arr !== undefined ? arr.indexOf(entity) : -1;

    if (index !== -1) {
        arr.slice(index, 1);
    }
}

export function getEntities<
    H extends Heap,
    E extends ExtractEntity<H>,
    T extends ExtractTag<E>,
>(heap: H, tag: T): ExtractEntitiesByTag<E, T>[] {
    return (heap.entities[tag] ?? EMPTY_ARRAY) as ExtractEntitiesByTag<E, T>[];
}

export function filterEntities<E extends Entity, R extends E>(
    heap: Heap,
    fn: (e: E) => e is R,
): R[] {
    return (Object.values(heap.entities).flat() as E[]).filter(fn) as R[];
}
