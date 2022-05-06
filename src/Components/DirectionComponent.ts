import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';
import { Vector } from '../utils/shape';

export class DirectionComponent {
    constructor(public x: number = 0, public y: number = 0) {}
}

export function setDirection(component: DirectionComponent, v: Vector): void {
    component.x = v.x;
    component.y = v.y;
}

export function hasDirectionComponent(
    entity: Entity,
): entity is Entity<DirectionComponent> {
    return hasComponent(entity, DirectionComponent);
}
