import { Component } from './components';
import { Entity } from './entities';

export const $tag = '__tag__' as const;

export function getTag<T extends Component | Entity>(some: T): string {
    return (
        some as {
            [K in typeof $tag]: string;
        }
    )[$tag] as string;
}
