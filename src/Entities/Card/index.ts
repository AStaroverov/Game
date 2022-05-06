import { createEntity } from '../../../lib/ECS/entities';
import { PositionComponent } from '../../Components/PositionComponent';
import { TilesComponent } from '../../Components/TilesComponent';

export class CardEntity extends createEntity(
    (props: { w: number; h: number; sx: number; sy: number }) => [
        new PositionComponent(),
        new TilesComponent(props),
    ],
) {}

export const isCardEntity = (
    entity: CardEntity | unknown,
): entity is CardEntity => entity instanceof CardEntity;
