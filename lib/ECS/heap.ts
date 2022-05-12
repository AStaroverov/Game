import { Entity, EntityConstructor } from './entities';
import { getTag } from './tag';

export interface Heap {
    entities: Record<string, Entity>;
}

export function createHeap(): Heap {
    const entities: Record<string, Entity> = {};

    return { entities };
}

export function registerEntity<E extends Entity>(heap: Heap, entity: E): void {
    heap.entities[getTag(entity)] = entity;
}

export function unregisterEntity<E extends Entity>(
    heap: Heap,
    entity: E,
): void {
    delete heap.entities[getTag(entity)];
}

export function getEntity<EC extends EntityConstructor>(
    heap: Heap,
    Entity: EC,
): undefined | ReturnType<EC> {
    return heap.entities[Entity.name] as ReturnType<EC>;
}

export function getEntities<E extends Entity>(
    heap: Heap,
    fn: (e: Entity<any, any>) => e is E,
): E[] {
    return Object.values(heap.entities).filter(fn);
}
