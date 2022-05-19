import { $entity as $entity, Entity } from './Entity';
import { ExtractTag } from './types';

const EMPTY_ARRAY: any[] = [];

export type Heap<E extends Entity = Entity> = {
    entities: Record<ExtractTag<E>, E[]>;
};

export type ExtractEntities<H> = H extends Heap<infer E> ? E : never;

export type ExtractEntitiesByTag<
    E extends Entity,
    T extends ExtractTag<E>,
> = Extract<E, { [$entity]: T }>;

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
    const arr = heap.entities[entity[$entity]];
    const index = arr !== undefined ? arr.indexOf(entity) : -1;

    if (index !== -1) {
        arr.slice(index, 1);
    }
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
    E extends Entity,
    H extends Heap = Heap,
    T extends string = string,
>(heap: H, fn: (e: Entity) => e is E): E[] {
    return (Object.values(heap.entities).flat() as Entity[]).filter(fn) as E[];
}
