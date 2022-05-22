import { createComponent } from '../../lib/ECS/Component';
import { PlayerAction } from '../Systems/ActionSystem';

export const ActionableID = 'Actionable' as const;
export const createActionableComponent = <T extends PlayerAction>(props: {
    type?: T;
}) => createComponent(ActionableID, props);
