import { createComponent, isComponent } from './component';
import { createEntity, getComponent, hasComponent } from './entity';
import {
    createHeap,
    ExtractEntitiesByComponent,
    ExtractEntitiesByComponentTag,
    filterEntities,
    getEntities,
    registerEntity,
} from './heap';

const Component_0_ID = 'Component_0' as const;
const Component_0 = () => createComponent(Component_0_ID, { a: 1 });
type TComponent_0 = ReturnType<typeof Component_0>;
const component_0 = Component_0();

const Component_1_ID = 'Component_1' as const;
const Component_1 = () => createComponent(Component_1_ID, { b: 1 });
type TComponent_1 = ReturnType<typeof Component_1>;
const component_1 = Component_1();

const Component_2_ID = 'Component_2' as const;
const Component_2 = <T>(t: T) => createComponent(Component_2_ID, { t });
type TComponent_2 = ReturnType<typeof Component_2>;
const component_2 = Component_2(123);

const Component_ALL_ID = 'Component_ALL' as const;
const Component_ALL = () =>
    createComponent(
        Component_ALL_ID,
        { c: 1 },
        component_0,
        component_1,
        Component_2('h1'),
    );
type TComponent_ALL = ReturnType<typeof Component_ALL>;
const componentALL = Component_ALL();

isComponent(Component_0_ID, component_0);
isComponent(Component_1_ID, component_0); // Error

isComponent(Component_0_ID, component_1); // Error
isComponent(Component_1_ID, component_1);

isComponent(Component_ALL_ID, componentALL);

const Entity_0_ID = 'Entity_0' as const;
const Entity_0 = () =>
    createEntity(Entity_0_ID, [Component_0(), Component_1()]);
const entity_0 = Entity_0();

const Entity_1_ID = 'Entity_1' as const;
const Entity_1 = () =>
    createEntity(Entity_1_ID, [Component_1(), Component_2('2')]);
const entity_1 = Entity_1();

const Entity_2_ID = 'Entity_2' as const;
const Entity_2 = () =>
    createEntity(Entity_2_ID, [Component_2(2), Component_ALL()]);
const entity_2 = Entity_2();

hasComponent(entity_0, Component_0_ID);
hasComponent(entity_0, Component_1_ID);
hasComponent(entity_0, Component_2_ID); // Error
hasComponent(entity_0, Component_ALL_ID); // Error

hasComponent(entity_1, Component_0_ID); // Error
hasComponent(entity_1, Component_1_ID);
hasComponent(entity_1, Component_2_ID);
hasComponent(entity_1, Component_ALL_ID); // Error

hasComponent(entity_2, Component_0_ID); // Error
hasComponent(entity_2, Component_1_ID); // Error
hasComponent(entity_2, Component_2_ID);
hasComponent(entity_2, Component_ALL_ID);

const _g0 = getComponent(entity_2, Component_0_ID); // Error
const _g1 = getComponent(entity_2, Component_1_ID); // Error
const _g2 = getComponent(entity_2, Component_2_ID);
const _g3 = getComponent(entity_2, Component_ALL_ID);

const heap = createHeap([/*Entity_0, */ Entity_1, Entity_2]);

registerEntity(heap, entity_0); // Error
registerEntity(heap, entity_1);
registerEntity(heap, entity_2);

const _entity_0 = getEntities(heap, Entity_0_ID); // Error
const _entity_1 = getEntities(heap, Entity_1_ID);
const _entity_2 = getEntities(heap, Entity_2_ID);

const _entity_a = filterEntities(
    heap,
    (e): e is ExtractEntitiesByComponent<typeof e, TComponent_1> =>
        hasComponent(e, Component_1_ID),
);

const _entity_a1 = filterEntities(
    heap,
    (
        e,
    ): e is ExtractEntitiesByComponent<typeof e, TComponent_0> => // Error
        hasComponent(e, Component_0_ID), // Error
);

const _entity_b = filterEntities(
    heap,
    (e): e is ExtractEntitiesByComponentTag<typeof e, typeof Component_1_ID> =>
        hasComponent(e, Component_1_ID),
);

const _entity_b1 = filterEntities(
    heap,
    (
        e,
    ): e is ExtractEntitiesByComponentTag<typeof e, typeof Component_0_ID> => // Error
        hasComponent(e, Component_0_ID), // Error
);
