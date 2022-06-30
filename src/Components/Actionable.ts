import { createComponent } from '../../lib/ECS/Component';
import { CommonAction } from '../Systems/ActionSystem';
import { DialogID } from './Dialogs/data';

export const ActionableComponentID = 'ACTIONABLE' as const;
export type ActionableComponentProps =
    | { type: CommonAction.None }
    | {
          type: CommonAction.Dialog;
          dialogID: DialogID;
      }
    | {
          type: CommonAction.Open;
          itemID: string;
      };

export type ActionableComponent = ReturnType<typeof createActionableComponent>;
export const createActionableComponent = (props?: ActionableComponentProps) =>
    createComponent(ActionableComponentID, props ?? { type: CommonAction.None as const });
