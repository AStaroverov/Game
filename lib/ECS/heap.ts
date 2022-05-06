import { Component, Entity } from './types';

export interface Heap {
    registerEntity<E extends Entity>(entity: E): void;
    unregisterEntity<E extends Entity>(entity: E): void;
    getEntities<T extends Entity>(
        fn: (ref: Entity) => ref is T,
    ): IterableIterator<T>;
    getComponents<T extends Component>(
        fn: (ref: Component) => ref is T,
    ): IterableIterator<T>;
}
export function createHeap(): Heap {
    const entities = new Set<Entity>();
    const components = new Set<Component>();

    function registerEntity<E extends Entity>(entity: E): void {
        entities.add(entity);
        entity.components.forEach((value) => components.add(value));
    }

    function unregisterEntity<E extends Entity>(entity: E): void {
        entities.delete(entity);
        entity.components.forEach((value) => components.delete(value));
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

    function* getComponents<T extends Component>(
        fn: (ref: Component) => ref is T,
    ): IterableIterator<T> {
        for (const component of components.values()) {
            if (fn(component)) {
                yield component as T;
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
