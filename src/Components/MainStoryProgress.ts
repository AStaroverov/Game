import { createComponent } from '../../lib/ECS/Component';

export enum PlayerStoryStep {
    NewGame = 'NewGame',
    SearchFirstVillage = 'SearchFirstVillage',
}

export const PlayerStoryComponentID = 'MAIN_STORY' as const;
export const createPlayerStoryComponent = () =>
    createComponent(PlayerStoryComponentID, {
        currentStep: PlayerStoryStep.NewGame,
    });
