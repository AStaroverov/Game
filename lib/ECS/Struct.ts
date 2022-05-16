import { ExtractTag } from './types';

export const $component = '__COMPONENT__';
export const $inherited = '__INHERITED__';

export type Struct<
    Tag extends string = string,
    Body extends object = object,
    InheritedTag extends never | string = any,
> = {
    [$component]: Tag;
    [$inherited]: InheritedTag;
    body: Body;
};

export type ExtractInheritedTags<C> = C extends Struct<
    string,
    object,
    infer Tags
>
    ? Tags
    : never;

export type ExtractTags<C> = ExtractTag<C> | ExtractInheritedTags<C>;

export type ExtractBody<C> = C extends Struct<any, infer Body>
    ? Body
    : C extends object
    ? C
    : never;
