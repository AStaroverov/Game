import { createComponent, ExtractStruct } from '../../lib/ECS/Component';

export enum PlayerStoryStep {
    NewGame = 0,
    SearchFirstVillage = 1,
}

export const PlayerStoryComponentID = 'MAIN_STORY' as const;
export type PlayerStoryComponent = ReturnType<typeof createPlayerStoryComponent>;
export const createPlayerStoryComponent = () =>
    createComponent(PlayerStoryComponentID, {
        currentStep: PlayerStoryStep.NewGame,
    });

export function updatePlayerStoryStep(
    struct: ExtractStruct<PlayerStoryComponent>,
    step: PlayerStoryStep,
): void {
    struct.currentStep = step;
}
