import { createComponent, ExtractStruct } from '../../lib/ECS/Component';

export enum EUI {
    Dialog = 'Dialog',
    Journal = 'Journal',
    Backpack = 'Backpack',
}

export const UIComponentID = 'UI' as const;
export type UIComponent = ReturnType<typeof createUIComponent>;
export const createUIComponent = (props?: { currentUI: undefined | EUI }) =>
    createComponent(UIComponentID, {
        currentUI: props?.currentUI,
    });

export function setCurrentUI(struct: ExtractStruct<UIComponent>, ui: undefined | EUI) {
    struct.currentUI = ui;
}
