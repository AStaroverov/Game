const Component_0_ID = 'Component_0_ID' as const;
const Component_0 = () => ({ Component_0_ID, a: 1 });
type TComponent_0 = ReturnType<typeof Component_0>;
const component_0 = Component_0();

const Component_1_ID = 'Component_1_ID' as const;
const Component_1 = () => ({ Component_1_ID, b: 1 });
type TComponent_1 = ReturnType<typeof Component_1>;
const component_1 = Component_1();

const Component_2_ID = 'Component_2_ID' as const;
const Component_2 = <T>(t: T) => ({ Component_2_ID, t });
type TComponent_2 = ReturnType<typeof Component_2>;
const component_2 = Component_2('asd');

const Component_ALL_ID = 'Component_ALL_ID' as const;
const Component_ALL = () => ({
    Component_ALL_ID,
    c: 1,
    ...component_0,
    ...Component_1(),
    ...Component_2('test'),
});
type TComponent_ALL = ReturnType<typeof Component_ALL>;
const componentALL = Component_ALL();

export function isComponent<C extends object, ID extends keyof C>(
    c: C,
    id: ID,
): c is C {
    // return c[id] === tag;
    return true;
}

isComponent(component_0, Component_0_ID);
isComponent(component_0, Component_1_ID); // Error

isComponent(component_1, Component_0_ID); // Error
isComponent(component_1, Component_1_ID);

isComponent(componentALL, Component_0_ID);
isComponent(componentALL, Component_1_ID);
isComponent(componentALL, Component_ALL_ID);

type Entity<C extends object = object> = {
    components: C[];
};

const Entity_0_ID = 'Entity_0_ID' as const;
const Entity_0 = () => ({
    Entity_0_ID,
    components: [Component_0(), Component_1()],
});
const entity_0 = Entity_0();

const Entity_1_ID = 'Entity_1_ID' as const;
const Entity_1 = () => ({
    Entity_1_ID,
    components: [Component_1(), Component_2('2')],
});
const entity_1 = Entity_1();

const Entity_2_ID = 'Entity_2_ID' as const;
const Entity_2 = () => ({
    Entity_2_ID,
    components: [Component_2(2), Component_ALL()],
});
const entity_2 = Entity_2();

type ExtractComponents<E extends Entity> = E extends Entity<infer C>
    ? C
    : never;

const t = { Component_0_ID };
type A1 = ExtractComponents<typeof entity_2>;
type K1 = A1 extends typeof t ? true : false;

function hasComponent<E extends Entity, ID extends object>(
    entity: E,
    id: ID,
): entity is E {
    return entity.components.findIndex((e) => id in e) !== -1;
}

hasComponent(entity_0, { Component_0_ID });
hasComponent(entity_0, Component_1_ID);
hasComponent(entity_0, Component_2_ID); // Error
hasComponent(entity_0, Component_ALL_ID); // Error

hasComponent(entity_1, Component_0_ID); // Error
hasComponent(entity_1, Component_1_ID);
hasComponent(entity_1, Component_2_ID);
hasComponent(entity_1, Component_ALL_ID); // Error

hasShallowComponent(entity_2, Component_0_ID); // Error
hasShallowComponent(entity_2, Component_1_ID); // Error
hasInheritedComponent(entity_2, Component_0_ID);
hasInheritedComponent(entity_2, Component_1_ID);
hasShallowComponent(entity_2, Component_2_ID);
hasShallowComponent(entity_2, Component_ALL_ID);

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

// export type ExtractComponentsByTag<S extends Struct, T extends ExtractTags<S>> =
//     ExtractComponentsByShallowTag<S, T> | ExtractComponentsByInheritedTag<S, T>;
//
// export type ExtractEntitiesByComponentTag<
//     E extends Entity,
//     T extends ExtractTags<ExtractComponents<E>>,
//     C extends ExtractComponents<E> = ExtractComponents<E>,
//     DC extends ExtractComponentsByTag<C, T> = ExtractComponentsByTag<C, T>,
// > = DC extends never ? never : Extract<Entity<any, DC>, E>;
//
// type E = ExtractEntity<typeof heap>;
// type C = ExtractComponents<E>;
// type FC = ExtractComponentsByTag<C, typeof Component_1_ID>;

const _entity_b = filterEntities(
    heap,
    (e): e is ExtractEntitiesByComponentTag<typeof e, typeof Component_1_ID> =>
        hasComponent(e, Component_1_ID),
);

const _entity_sb = filterEntities(
    heap,
    (
        e,
    ): e is ExtractEntitiesByComponentShallowTag<
        typeof e,
        typeof Component_1_ID
    > => hasShallowComponent(e, Component_1_ID),
);

const _entity_ib = filterEntities(
    heap,
    (
        e,
    ): e is ExtractEntitiesByComponentInheritedTag<
        typeof e,
        typeof Component_1_ID
    > => hasInheritedComponent(e, Component_1_ID),
);

const _entity_b1 = filterEntities(
    heap,
    (
        e,
    ): e is ExtractEntitiesByComponentShallowTag<
        typeof e,
        typeof Component_0_ID // Error
    > => hasShallowComponent(e, Component_0_ID), // Error
);
