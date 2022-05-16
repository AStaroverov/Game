import { createEntity } from '../../../lib/ECS/Entity';
import { createGameTimeComponent } from '../../Components/GameTime';

export const WorldEntityID = 'WORLD_ENTITY' as const;
export const createWorldEntity = () =>
    createEntity(WorldEntityID, [createGameTimeComponent()]);
