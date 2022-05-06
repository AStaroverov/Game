import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';

export class SizeComponent {
    constructor(public w: number, public h: number) {}
}

export function hasSizeComponent(
    entity: Entity,
): entity is Entity<SizeComponent> {
    return hasComponent(entity, SizeComponent);
}
