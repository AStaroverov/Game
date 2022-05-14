import { createComponentConstructor } from '../../lib/ECS/components';
import { Entity, EntityWith, hasComponent } from '../../lib/ECS/entities';
import { Vector } from '../utils/shape';

export type DirectionComponent = Vector;
export const DirectionConstructor = createComponentConstructor(
    'DirectionConstructor',
    (x = 0, y = 0): DirectionComponent => {
        return {
            x,
            y,
        };
    },
);

export function setDirection(
    component: DirectionComponent,
    x: number,
    y: number,
): void {
    component.x = x;
    component.y = y;
}

export function hasDirectionComponent(
    entity: Entity,
): entity is EntityWith<typeof DirectionConstructor> {
    return hasComponent(entity, DirectionConstructor);
}
