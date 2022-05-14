import { Entity } from './Entity';
import { ExtractBody, Struct } from './Struct';

export type ExtractTag<T> = T extends Struct<infer Tag>
    ? Tag
    : T extends Entity<infer Tag>
    ? Tag
    : never;

export type Like<C extends Struct> =
    | Struct<ExtractTag<C>, ExtractBody<C>>
    | Struct<any, ExtractBody<C>, ExtractTag<C>>;
