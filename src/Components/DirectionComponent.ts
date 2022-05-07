import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';

export class DirectionComponent {
    constructor(public x: number = 0, public y: number = 0) {}
}

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
): entity is Entity<DirectionComponent> {
    return hasComponent(entity, DirectionComponent);
}
