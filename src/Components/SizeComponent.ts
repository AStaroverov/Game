import { createComponent } from '../../lib/ECS/components';
import { hasComponent } from '../../lib/ECS/entities';
import { Entity } from '../../lib/ECS/types';

export class SizeComponent extends createComponent(
    (props: { w: number; h: number }) => {
        return props;
    },
) {}

export function hasSizeComponent(
    entity: Entity,
): entity is Entity<SizeComponent> {
    return hasComponent(entity, SizeComponent);
}
