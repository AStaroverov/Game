import { Entity, EntityConstructor } from './entities';
import { $tag } from './tag';
import { EMPTY_ARRAY } from './utils';

export interface Heap {
    entities: Record<string, Entity[]>;
}

export function createHeap(): Heap {
    const entities: Record<string, Entity[]> = {};

    return { entities };
}

export function registerEntity<E extends Entity>(heap: Heap, entity: E): void {
    if (heap.entities[entity[$tag]] === undefined) {
        heap.entities[entity[$tag]] = [];
    }

    heap.entities[entity[$tag]].push(entity);
}

export function unregisterEntity<E extends Entity>(
    heap: Heap,
    entity: E,
): void {
    const arr = heap.entities[entity[$tag]];
    const index = arr !== undefined ? arr.indexOf(entity) : -1;

    if (index !== -1) {
        arr.slice(index, 1);
    }
}

export function getEntities<EC extends EntityConstructor>(
    heap: Heap,
    Entity: EC,
): ReturnType<EC>[] {
    return (heap.entities[Entity[$tag]] ?? EMPTY_ARRAY) as ReturnType<EC>[];
}

export function filterEntities<E extends Entity>(
    heap: Heap,
    fn: (e: Entity<any, any>) => e is E,
): E[] {
    return Object.values(heap.entities).flat().filter(fn);
}
