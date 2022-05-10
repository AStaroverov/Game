import { Entity } from '../../../lib/ECS/entities';
import { GameTimeComponent } from '../../Components/GameTime';

export class WorldEntity extends Entity {
    constructor() {
        super([new GameTimeComponent()]);
    }
}

export const isWorldEntity = (
    entity: WorldEntity | unknown,
): entity is WorldEntity => entity instanceof WorldEntity;
