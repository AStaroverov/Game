import { ExtractTag } from './types';

export const $struct = '__STRUCT__' as const;
export const $component = '__COMPONENT__' as const;
export const $inherited = '__INHERITED__' as const;

export type ComponentTag<Tag extends unknown | string = string> = {
    [$component]: Tag;
};

export type ComponentStruct<Struct extends object = object> = {
    [$struct]: Struct;
};

export type ComponentInherited<Inherited extends unknown | string = never> = {
    [$inherited]: Inherited;
};

export type Component<
    Tag extends unknown | string = string,
    Struct extends object = object,
    Inherited extends unknown | string = never,
> = ComponentTag<Tag> & ComponentStruct<Struct> & ComponentInherited<Inherited>;

export type AnyComponent = Component<any, any, any>;

export type InheritedComponent<C extends Component<any, any, any>> =
    ComponentTag<unknown> &
        ComponentInherited<ExtractTag<C>> &
        ComponentStruct<ExtractStruct<C>>;

export type ExtractTags<C> = ExtractTag<C> | ExtractInherited<C>;

export type ExtractInherited<C> = C extends ComponentInherited<infer Inherited>
    ? Inherited
    : never;

export type ExtractStruct<C> = C extends ComponentStruct<infer Body>
    ? Body
    : C extends object
    ? C
    : never;

export type ReturnStruct<
    F extends (...args: any[]) => Component<any, any, any>,
> = ExtractStruct<ReturnType<F>>;

function createComponent<Tag extends string, B1 extends object>(
    tag: Tag,
    b1: B1,
): Component<Tag, ExtractStruct<B1>, ExtractTags<B1>>;
function createComponent<
    Tag extends string,
    B1 extends object,
    B2 extends object,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
): Component<
    Tag,
    ExtractStruct<B1> & ExtractStruct<B2>,
    ExtractTags<B1> | ExtractTags<B2>
>;
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
): Component<
    Tag,
    ExtractStruct<B1> & ExtractStruct<B2> & ExtractStruct<B3>,
    ExtractTags<B1> | ExtractTags<B2> | ExtractTags<B3>
>;
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
        ExtractStruct<B4>,
    ExtractTags<B1> | ExtractTags<B2> | ExtractTags<B3> | ExtractTags<B4>
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

export function isComponent<C extends Component<any, any, any>>(
    c: C,
    tag: ExtractTag<C>,
): c is C {
    return c[$component] === tag;
}

export function isInheritedComponent<
    C extends Component<any, any, any>,
    T extends string,
>(c: C, tag: T): c is C {
    return c[$component] === tag || tag in c[$inherited];
}

export function getStruct<C extends Component<any, any, any>>(
    s: C,
): ExtractStruct<C> {
    return s[$struct] as ExtractStruct<C>;
}
