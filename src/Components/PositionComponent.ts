import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';

export class PositionComponent {
    constructor(public x: number = 0, public y: number = 0) {}
}

export const isPositionComponent = (
    comp: PositionComponent | unknown,
): comp is PositionComponent => comp instanceof PositionComponent;

export function hasPositionComponent(
    entity: Entity,
): entity is Entity<PositionComponent> {
    return hasComponent(entity, PositionComponent);
}
