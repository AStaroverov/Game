import { ExtractTag } from './types';

export const $tag = '__COMPONENT__';
export const $inheritedTag = '__INHERITED__';

export type Struct<
    Tag extends string = string,
    Body extends object = object,
    InheritedTag extends never | string = never | string,
> = { [$tag]: Tag; [$inheritedTag]: InheritedTag; body: Body };

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
