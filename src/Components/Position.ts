import {
    Component,
    ComponentType,
    createComponentConstructor,
    isComponent,
} from '../../lib/ECS/components';
import { Entity, EntityWith, hasComponent } from '../../lib/ECS/entities';
import { Vector } from '../utils/shape';

export type PositionComponent = ComponentType<typeof PositionConstructor>;
export const PositionConstructor = createComponentConstructor(
    'PositionConstructor',
    (props?: Partial<Vector>) => {
        return { x: props?.x ?? 0, y: props?.y ?? 0 };
    },
);

export function isPositionComponent(
    comp: PositionComponent | Component,
): comp is PositionComponent {
    return isComponent(comp, PositionConstructor);
}

export function hasPositionComponent(
    entity: Entity,
): entity is EntityWith<typeof PositionConstructor> {
    return hasComponent(entity, PositionConstructor);
}
