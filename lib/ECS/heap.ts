import { Component, CreateComponent, CreateEntity, Entity } from './types';

export interface Heap {
    registerEntity<E extends Entity>(entity: E): void;
    unregisterEntity<E extends Entity>(entity: E): void;
    getEntities<CE extends CreateEntity>(
        fn: (ref: CreateEntity) => ref is CE,
    ): IterableIterator<ReturnType<CE>>;
    getComponents<CC extends CreateComponent>(
        fn: (ref: CreateComponent) => ref is CC,
    ): IterableIterator<ReturnType<CC>>;
}
export function createHeap(): Heap {
    const entities = new Set<Entity>();
    const components = new Set<Component>();

    function registerEntity<E extends Entity>(entity: E): void {
        entities.add(entity);
        entity.map.forEach((value) => components.add(value));
    }

    function unregisterEntity<E extends Entity>(entity: E): void {
        entities.delete(entity);
        entity.map.forEach((value) => components.delete(value));
    }

    function* getEntities<CE extends CreateEntity>(
        fn: (ref: CreateEntity) => ref is CE,
    ): IterableIterator<ReturnType<CE>> {
        for (const entity of entities.values()) {
            if (fn(entity.ref)) {
                yield entity as ReturnType<CE>;
            }
        }
    }

    function* getComponents<CC extends CreateComponent>(
        fn: (ref: CreateComponent) => ref is CC,
    ): IterableIterator<ReturnType<CC>> {
        for (const component of components.values()) {
            if (fn(component.ref)) {
                yield component.payload as ReturnType<CC>;
            }
        }
    }

    return {
        registerEntity,
        unregisterEntity,
        getEntities,
        getComponents,
    };
}
