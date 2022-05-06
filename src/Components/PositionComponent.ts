import { createComponent } from '../../lib/ECS/components';
import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';
import { newPoint, Point } from '../utils/shape';

export class PositionComponent extends createComponent(
    (p: Point = newPoint(0, 0)) => p,
) {}

export function hasPositionComponent(
    entity: Entity,
): entity is Entity<PositionComponent> {
    return hasComponent(entity, PositionComponent);
}

export function positionMove(
    p: PositionComponent,
    dx: number,
    dy: number,
): void {
    p.x += dx;
    p.y += dy;
}
