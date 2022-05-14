import { Component } from './component';
import { Entity } from './entity';

export type ExtractTag<S> = S extends Component<infer Tag>
    ? Tag
    : S extends Entity<infer Tag>
    ? Tag
    : never;
