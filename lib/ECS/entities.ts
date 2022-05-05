import { Component, CreateComponent, CreateEntity, Entity } from './types';

export function createEntity<P extends unknown[], C extends Component<unknown>>(
    filler: (...props: P) => C[],
): CreateEntity<P, Entity<C>> {
    function Entity(...props: P): Entity<C> {
        return {
            ref: Entity,
            map: new Map(
                filler(...props).map((component) => {
                    return [component.ref, component];
                }),
            ),
        };
    }

    return Entity;
}

export function getComponent<C extends Component, CE extends CreateComponent>(
    entity: Entity<C>,
    ref: CE,
): ReturnType<CE>['payload'] {
    return entity.map.get(ref)!['payload'] as ReturnType<CE>['payload'];
}
