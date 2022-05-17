import { Component } from './Component';
import { Entity } from './Entity';

export type ExtractTag<T> = T extends Component<infer Tag>
    ? Tag
    : T extends Entity<infer Tag>
    ? Tag
    : never;
