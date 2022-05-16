import {
    $component,
    $inherited,
    ExtractBody,
    ExtractTags,
    Struct,
} from './Struct';
import { ExtractTag } from './types';

export type Component<
    Tag extends string = string,
    B1 extends void | object = {},
    B2 extends void | object = {},
    B3 extends void | object = {},
    B4 extends void | object = {},
> = Struct<
    Tag,
    ExtractBody<B1> & ExtractBody<B2> & ExtractBody<B3> & ExtractBody<B4>,
    ExtractTags<B1> | ExtractTags<B2> | ExtractTags<B3> | ExtractTags<B4>
>;

function createComponent<Tag extends string, B1 extends object>(
    tag: Tag,
    b1: B1,
): Struct<Tag, ExtractBody<B1>, ExtractTags<B1>>;
function createComponent<
    Tag extends string,
    B1 extends object,
    B2 extends object,
>(
    tag: Tag,
    b1: B1,
    b2: B2,
): Struct<
    Tag,
    ExtractBody<B1> & ExtractBody<B2>,
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
): Struct<
    Tag,
    ExtractBody<B1> & ExtractBody<B2> & ExtractBody<B3>,
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
): Struct<
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
        if ($component in component) {
            acc[component[$component]] = true;
            Object.assign(acc, component[$inherited]);
        }

        return acc;
    }, {});
    const body = Object.assign(
        {},
        ...components.map((c) => (c[$component] ? c.body : c)),
    );

    return {
        body,
        [$component]: tag,
        [$inherited]: inheritedTags,
    };
}

export { createComponent };

export function isComponent<S extends Struct, T extends ExtractTag<S>>(
    s: S,
    tag: T,
): s is S {
    return s[$component] === tag;
}

// export function getComponent<S extends Struct>(tag: ExtractTags<S>, s: S): S {
//     return s;
// }

// export function getComponentBody<S extends Struct>(
//     tag: ExtractTags<S>,
//     s: S,
// ): S['body'] {
//     return s.body;
// }
//
// export function hasInheritedComponent<
//     T extends string,
//     S extends Struct<any, object, T>,
// >(tag: T, s: S): s is S {
//     debugger;
//     return (s[$inheritedTag] as any)[tag] === true;
// }
