import { Mesh } from 'three';

import { Entity } from '../../lib/ECS/Entity';
import { getAllEntities } from '../../lib/ECS/Heap';
import { GameHeap } from '../heap';
import { Layer, Scenes } from '../Renderer';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

const heap = new Map<Entity, Map<string, Mesh>>();

export function getEntityMeshes(entity: Entity): Mesh[] {
    const store = heap.get(entity);
    return store === undefined ? [] : [...store.values()];
}

export function createMeshStore<T extends Mesh>(entity: Entity) {
    const store = new Map<string, T>();

    heap.set(entity, store);

    function destroy(): void {
        heap.delete(entity);
    }
    function clear(): void {
        store.clear();
    }
    function set(key: string, mesh: T): void {
        store.set(key, mesh);
    }
    function get(key: string): undefined | T {
        return store.get(key);
    }
    function getset(key: string, set: () => T): T {
        if (!store.has(key)) store.set(key, set());
        return store.get(key)!;
    }

    return {
        destroy,
        clear,
        set,
        get,
        getset,
    };
}

export function runMeshSystem(heap: GameHeap, ticker: TasksScheduler, scenes: Scenes) {
    ticker.addFrameInterval(tick, 1);

    function tick() {
        // scenes[Layer.Main].clear();
        // scenes[Layer.Fixed].clear();

        getAllEntities(heap).forEach((entity) => {
            getEntityMeshes(entity).forEach((mesh) => {
                scenes[Layer.Main].add(mesh);
            });
        });
    }
}
