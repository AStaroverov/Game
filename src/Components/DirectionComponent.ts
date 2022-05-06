import { createComponent } from '../../lib/ECS/components';
import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';
import { newVector, Vector } from '../utils/shape';

export class DirectionComponent extends createComponent(
    (v: Vector = newVector(0, 0)) => v,
) {}

export function hasDirectionComponent(
    entity: Entity,
): entity is Entity<DirectionComponent> {
    return hasComponent(entity, DirectionComponent);
}
