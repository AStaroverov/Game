import { Component, CreateComponent } from './types';

export function createComponent<P extends unknown[], C>(
    creator: (...props: P) => C,
): CreateComponent<P, Component<C>> {
    function Component(...props: P) {
        return { ref: Component, payload: creator(...props) };
    }

    return Component;
}
