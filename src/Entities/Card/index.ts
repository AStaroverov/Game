import { createEntity } from '../../../lib/ECS/entities';
import { CreateEntity } from '../../../lib/ECS/types';
import { PositionComponent } from '../../Components/positionComponent';
import { TilesComponent } from '../../Components/TilesComponent';

export const CardEntity = createEntity(
    (props: { w: number; h: number; sx: number; sy: number }) => [
        PositionComponent(),
        TilesComponent(props),
    ],
);

export const isCardEntity = (
    entity: CreateEntity,
): entity is typeof CardEntity => entity === CardEntity;
