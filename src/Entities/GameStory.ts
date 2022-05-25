import { createEntity } from '../../lib/ECS/Entity';
import { createPlayerStoryComponent } from '../Components/MainStoryProgress';

export const GameStoryEntityID = 'GAME_STORY_ENTITY' as const;
export type GameStoryEntity = ReturnType<typeof createGameStoryEntity>;
export const createGameStoryEntity = () => {
    return createEntity(GameStoryEntityID, [createPlayerStoryComponent()]);
};
