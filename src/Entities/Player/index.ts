import { createEntity } from '../../../lib/ECS/entities';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { Point } from '../../utils/shape';

export class PlayerEntity extends createEntity((startPoint: Point) => [
    new PositionComponent(startPoint),
    new DirectionComponent(),
]) {}

export const isPlayerEntity = (
    entity: PlayerEntity | unknown,
): entity is PlayerEntity => entity instanceof PlayerEntity;
