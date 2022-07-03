import { EDialogueName } from '../../assets/dialogue/dialogue';
import { createComponent } from '../../lib/ECS/Component';
import { CommonAction } from '../Systems/ActionSystem';

export const ActionableComponentID = 'ACTIONABLE' as const;
export type ActionableComponentProps =
    | { type: CommonAction.None }
    | {
          type: CommonAction.Dialog;
          dialogID: EDialogueName;
      }
    | {
          type: CommonAction.Open;
          itemID: string;
      };

export type ActionableComponent = ReturnType<typeof createActionableComponent>;
export const createActionableComponent = (props?: ActionableComponentProps) =>
    createComponent(ActionableComponentID, props ?? { type: CommonAction.None as const });
