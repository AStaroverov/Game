import { ExtractTag } from './types';

export const $tag = '__COMPONENT__';
export const $inheritedTag = '__INHERITED__';

export type Component<
    Tag extends string = string,
    Body extends object = object,
    InheritedTag extends string = string,
> = { [$tag]: Tag; [$inheritedTag]: InheritedTag } & Body;

export type ExtractInheritedTags<C extends object | Component> =
    C extends Component<any, any, infer Tags> ? Tags : never;
export type ExtractTags<C extends object | Component> =
    | ExtractTag<C>
    | ExtractInheritedTags<C>;
export type ExtractBody<C extends object | Component> = C extends Component<
    any,
    infer Body,
    any
>
    ? Body
    : C extends object
    ? C
    : never;

function createComponent<
    Tag extends string = string,
    B1 extends object | Component = object | Component,
>(tag: Tag, b1: B1): Component<Tag, ExtractBody<B1>, ExtractTags<B1>>;
function createComponent<
    Tag extends string = string,
    B1 extends object | Component = object | Component,
    B2 extends object | Component = object | Component,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
): Component<
    Tag,
    ExtractBody<B1> & ExtractBody<B2>,
    ExtractTags<B1> | ExtractTags<B2>
>;
function createComponent<
    Tag extends string = string,
    B1 extends object | Component = object | Component,
    B2 extends object | Component = object | Component,
    B3 extends object | Component = object | Component,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
    b3: B3,
): Component<
    Tag,
    ExtractBody<B1> & ExtractBody<B2> & ExtractBody<B3>,
    ExtractTags<B1> | ExtractTags<B2> | ExtractTags<B3>
>;
function createComponent<
    Tag extends string = string,
    B1 extends object | Component = object | Component,
    B2 extends object | Component = object | Component,
    B3 extends object | Component = object | Component,
    B4 extends object | Component = object | Component,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
    b3: B3,
    b4: B4,
): Component<
    Tag,
    ExtractBody<B1> & ExtractBody<B2> & ExtractBody<B3> & ExtractBody<B4>,
    ExtractTags<B1> | ExtractTags<B2> | ExtractTags<B3> | ExtractTags<B4>
>;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function createComponent<Tag extends string = string>(
    tag: Tag,
    ...components: any[]
) {
    const inheritedTags = components.reduce((acc, component) => {
        Object.assign(acc, { [component[$tag]]: true });

        if ($inheritedTag in component) {
            Object.assign(acc, component[$inheritedTag]);
        }

        return acc;
    }, {});
    debugger;
    const body = Object.assign({}, ...components);

    return {
        [$tag]: tag,
        [$inheritedTag]: inheritedTags,
        ...body,
    };
}

export { createComponent };

export function isComponent<
    T extends string,
    S extends Component<T, object, never>,
>(tag: T, s: S): s is S {
    return s[$tag] === tag;
}

export function getComponent<S extends Component>(
    tag: ExtractTags<S>,
    s: S,
): S {
    return s;
}

export function hasInheritedComponent<
    T extends string,
    S extends Component<any, object, T>,
>(tag: T, s: S): s is S {
    debugger;
    return (s[$inheritedTag] as any)[tag] === true;
}
