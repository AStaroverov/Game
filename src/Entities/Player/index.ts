import { createEntity } from '../../../lib/ECS/entities';
import { CreateEntity } from '../../../lib/ECS/types';
import { Direction } from '../../Components/direction';
import { PositionComponent } from '../../Components/positionComponent';
import { Point } from '../../utils/shape';

export const PlayerEntity = createEntity((startPoint: Point) => [
    PositionComponent(startPoint),
    Direction(),
]);

export const isPlayerEntity = (
    entity: CreateEntity,
): entity is typeof PlayerEntity => entity === PlayerEntity;
