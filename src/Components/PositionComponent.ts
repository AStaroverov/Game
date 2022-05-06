import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';
import { Vector } from '../utils/shape';

export class PositionComponent {
    constructor(public x: number = 0, public y: number = 0) {}
}

export function hasPositionComponent(
    entity: Entity,
): entity is Entity<PositionComponent> {
    return hasComponent(entity, PositionComponent);
}

export function positionMove(p: PositionComponent, v: Vector): void {
    p.x += v.x;
    p.y += v.y;
}
