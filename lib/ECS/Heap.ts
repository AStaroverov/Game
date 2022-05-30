import { $entity as $entity, Entity, EntityTag, SomeEntity } from './Entity';
import { ExtractTag } from './types';

const EMPTY_ARRAY: any[] = [];

export type Heap<E extends Entity = Entity> = {
    entities: Record<ExtractTag<E>, E[]>;
};

export type ExtractEntities<H> = H extends Heap<infer E> ? E : never;

export type ExtractEntitiesByTag<
    E extends Entity,
    T extends ExtractTag<E>,
> = Extract<E, EntityTag<T>>;

export function createHeap<H extends Heap = Heap>(seed: object = {}): H {
    const entities = seed;

    return { entities } as H;
}

export function addEntity<H extends Heap, E extends Entity>(
    heap: H,
    entity: E,
): void {
    if (heap.entities[entity[$entity]] === undefined) {
        heap.entities[entity[$entity]] = [];
    }

    heap.entities[entity[$entity]].push(entity);
}

export function deleteEntity<H extends Heap, E extends Entity>(
    heap: H,
    entity: E,
): void {
    delete heap.entities[entity[$entity]];
}

export function getSnapshot(heap: Heap): object {
    return heap.entities;
}

export function getEntities<
    E extends ExtractEntities<H>,
    H extends Heap = Heap,
    T extends ExtractTag<E> = ExtractTag<E>,
>(heap: H, tag: T): ExtractEntitiesByTag<E, T>[] {
    return (heap.entities[tag] ?? EMPTY_ARRAY) as ExtractEntitiesByTag<E, T>[];
}

export function filterEntities<
    H extends Heap,
    E extends ExtractEntities<H> | SomeEntity,
    R extends E,
>(heap: H, fn: (e: E) => e is R): R[] {
    return (Object.values(heap.entities).flat() as E[]).filter(fn) as R[];
}
