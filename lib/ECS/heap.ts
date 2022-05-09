import { Entity } from './types';

export interface Heap {
    entities: Set<Entity>;
    registerEntity<E extends Entity>(entity: E): void;
    unregisterEntity<E extends Entity>(entity: E): void;
    getEntities<T extends Entity>(
        fn: (ref: Entity) => ref is T,
    ): IterableIterator<T>;
}

export function createHeap(): Heap {
    const entities = new Set<Entity>();

    function registerEntity<E extends Entity>(entity: E): void {
        entities.add(entity);
    }

    function unregisterEntity<E extends Entity>(entity: E): void {
        entities.delete(entity);
    }

    function* getEntities<T extends Entity>(
        fn: (ref: Entity) => ref is T,
    ): IterableIterator<T> {
        for (const entity of entities.values()) {
            if (fn(entity)) {
                yield entity as T;
            }
        }
    }

    return {
        entities,
        getEntities,
        registerEntity,
        unregisterEntity,
        // getComponents: getHeapComponents,
    };
}

export function registerEntity<E extends Entity>(heap: Heap, entity: E): void {
    heap.entities.add(entity);
}

export function unregisterEntity<E extends Entity>(
    heap: Heap,
    entity: E,
): void {
    heap.entities.delete(entity);
}

export function* getEntities<T extends Entity>(
    heap: Heap,
    fn: (ref: Entity) => ref is T,
): IterableIterator<T> {
    for (const entity of heap.entities.values()) {
        if (fn(entity)) {
            yield entity as T;
        }
    }
}
