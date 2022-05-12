import {
    Component,
    ComponentConstructor,
    ExtractComponentBody,
    ExtractComponentTag,
    ExtractConstructorComponentBody,
    ExtractConstructorComponentTag,
} from './components';
import { $tag } from './tag';

export type Entity<
    Tag extends string = string,
    Comps extends Component = Component,
> = {
    [$tag]: Tag;
    components: Record<string, Comps>;
};

export type EntityConstructor<
    Tag extends string = string,
    Props extends any[] = any[],
    Comps extends Component = Component,
> = {
    (...props: Props): Entity<Tag, Comps>;
    [$tag]: Tag;
};

export type EntityWith<CC extends ComponentConstructor> = Entity<
    string,
    Component<
        ExtractConstructorComponentTag<CC>,
        ExtractConstructorComponentBody<CC>
    >
>;

export type ExtractEntityComponents<E extends Entity> = E extends Entity<
    string,
    infer Comps
>
    ? Comps
    : never;

export function createEntityConstructor<
    Tag extends string = string,
    Props extends any[] = any[],
    Comps extends Component = Component,
>(
    tag: Tag,
    filler: (...props: Props) => Comps[],
): EntityConstructor<Tag, Props, Comps> {
    const wrapped = (...props: Props) => {
        return {
            [$tag]: tag,
            components: filler(...props).reduce((acc, component) => {
                // @ts-ignore
                acc[component[$tag]] = component;
                return acc;
            }, {} as Record<Comps[typeof $tag], Comps>),
        };
    };

    // @ts-ignore
    wrapped[$tag] = tag;

    return wrapped as EntityConstructor<Tag, Props, Comps>;
}

export function getComponent<
    E extends Entity,
    C extends ExtractEntityComponents<E>,
>(
    entity: E,
    Component: ComponentConstructor<
        ExtractComponentTag<C>,
        any[],
        ExtractComponentBody<C>
    >,
): C {
    return entity.components[Component[$tag]] as C;
}

export function hasComponent<E extends Entity, CC extends ComponentConstructor>(
    entity: E,
    Component: CC,
): boolean {
    return Component[$tag] in entity.components;
}
