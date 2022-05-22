import { ExtractTag } from './types';

export const $component = '__COMPONENT__' as const;
export const $struct = '__STRUCT__' as const;
export const $inherited = '__INHERITED__' as const;

export type ComponentTag<Tag extends string = string> = {
    [$component]: Tag;
};

export type ComponentStruct<Struct extends void | object = void | object> = {
    [$struct]: Struct;
};

export type Component<
    Tag extends string = string,
    Struct extends void | object = void | object,
> = ComponentTag<Tag> & ComponentStruct<Struct>;

export type SomeComponent<Body extends object = object> = ComponentTag<'*'> &
    ComponentStruct<Body>;

export type NullableComponent<C extends Component = Component> = ComponentTag<
    ExtractTag<C>
> &
    ComponentStruct<void | ExtractStruct<C>>;

export type ExtractStruct<C> = C extends Component<any, infer Body>
    ? Body
    : C extends object
    ? C
    : never;

export type ReturnStruct<F extends (...args: any[]) => Component> =
    ReturnType<F>[typeof $struct];

function createComponent<Tag extends string, B1 extends object>(
    tag: Tag,
    b1: B1,
): Component<Tag, ExtractStruct<B1>>;
function createComponent<
    Tag extends string,
    B1 extends object,
    B2 extends object,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
): Component<Tag, ExtractStruct<B1> & ExtractStruct<B2>>;
function createComponent<
    Tag extends string,
    B1 extends object,
    B2 extends object,
    B3 extends object,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
    b3: B3,
): Component<Tag, ExtractStruct<B1> & ExtractStruct<B2> & ExtractStruct<B3>>;
function createComponent<
    Tag extends string,
    B1 extends object,
    B2 extends object,
    B3 extends object,
    B4 extends object,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
    b3: B3,
    b4: B4,
): Component<
    Tag,
    ExtractStruct<B1> &
        ExtractStruct<B2> &
        ExtractStruct<B3> &
        ExtractStruct<B4>
>;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createComponent<Tag extends string = string>(
    tag: Tag,
    ...components: any[]
) {
    const inheritedTags = components.reduce((acc, component) => {
        if ($component in component) {
            acc[component[$component]] = true;
            Object.assign(acc, component[$inherited]);
        }

        return acc;
    }, {});
    const struct = Object.assign(
        {},
        ...components.map((c) => ($struct in c ? c[$struct] : c)),
    );

    return {
        [$struct]: struct,
        [$component]: tag,
        [$inherited]: inheritedTags,
    };
}

export { createComponent };

export function isComponent<C extends Component>(
    c: C,
    tag: ExtractTag<C>,
): c is C {
    return c[$component] === tag;
}

export function isInheritedComponent<S extends Component, T extends string>(
    s: S,
    tag: T,
): s is S {
    return (
        s[$component] === tag ||
        tag in ((s as any)[$inherited] as Record<string, Component>)
    );
}

export function getStruct<S extends Component>(s: S): ExtractStruct<S> {
    return s[$struct] as ExtractStruct<S>;
}
