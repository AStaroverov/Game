import { Component, Constructor, Entity } from './types';

export function createEntity<P extends unknown[], C extends Component>(
    filler: (...props: P) => C[],
): new (...props: P) => Entity<C> {
    return class {
        components = new Map<Constructor<C>, C>();

        constructor(...props: P) {
            filler(...props).forEach((value) => {
                this.components.set(
                    // @ts-ignore
                    value.__proto__.constructor as Constructor<C>,
                    value,
                );
            });
        }
    };
}

export function getComponent<E extends Entity, C extends Component>(
    entity: E,
    Component: Constructor<C>,
): C {
    return entity.components.get(Component) as C;
}

export function hasComponent<E extends Entity, C extends Component>(
    entity: E,
    Component: Constructor<C>,
): boolean {
    return entity.components.has(Component);
}
