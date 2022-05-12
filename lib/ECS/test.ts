import { createComponentConstructor } from './components';
import {
    createEntityConstructor,
    EntityWith,
    getComponent,
    hasComponent,
} from './entities';
import {
    createHeap,
    filterEntities,
    getEntities,
    registerEntity,
} from './heap';

const ComponentAAA = createComponentConstructor('ComponentAAA', (v: string) => {
    return {
        str: v,
    };
});

const ComponentBBB = createComponentConstructor('ComponentBBB', (v: string) => {
    return {
        str: v,
    };
});

const EntityAAA = createEntityConstructor('EntityAAA', () => {
    return [ComponentAAA('a')];
});
const EntityBBB = createEntityConstructor('EntityBBB', () => {
    return [ComponentAAA('a'), ComponentBBB('b')];
});

const heap = createHeap();

const entityAAA = EntityAAA();
const entityBBB = EntityBBB();

registerEntity(heap, entityAAA);
registerEntity(heap, entityBBB);

const _entityBBB = getEntities(heap, EntityBBB);
const _componentBBB = getComponent(_entityBBB[0]!, ComponentBBB);

const _entityAAA = getEntities(heap, EntityAAA);
// const __componentBBB = getComponent(_entityAAA[0]!, ComponentBBB);

const entitiesWithComponentAAA = filterEntities(
    heap,
    (e): e is EntityWith<typeof ComponentAAA> => hasComponent(e, ComponentAAA),
);

const __ComponentAAA = getComponent(entitiesWithComponentAAA[0], ComponentAAA);
