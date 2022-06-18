import { createComponent } from '../../lib/ECS/Component';

export enum UnspawnReason {
    OutOfCard = 'OutOfCard',
    OutOfRender = 'OutOfRender',
}

export const AutoUnspawnableComponentID = 'AUTO_UNSPAWNABLE' as const;
export type AutoUnspawnableComponent = ReturnType<typeof createAutoUnspawnableComponent>;
export const createAutoUnspawnableComponent = (reasons: UnspawnReason[]) =>
    createComponent(AutoUnspawnableComponentID, { reasons });
