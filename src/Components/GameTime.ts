import { createComponent } from '../../lib/ECS/Component';

export const GameTimeComponentID = 'GAME_TIME' as const;
export const createGameTimeComponent = (time = 1) => createComponent(GameTimeComponentID, { time });
