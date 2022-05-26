import { createComponent } from '../../lib/ECS/Component';
import { PlayerAction } from '../Systems/ActionSystem';

export const ActionableComponentID = 'Actionable' as const;
export type ActionableComponent = ReturnType<typeof createActionableComponent>;
export const createActionableComponent = <T extends PlayerAction>(props: {
    type?: T;
}) => createComponent(ActionableComponentID, props);
