import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';

export enum EDialogConstant {
    VILLAGE_APOTHECARY_EXIST = 'VILLAGE_APOTHECARY_EXIST',
    VILLAGE_APOTHECARY_NAME = 'VILLAGE_APOTHECARY_NAME',
    SICK_VILLAGER_EXIST = 'SICK_VILLAGER_EXIST',
    SICK_VILLAGER_NAME = 'SICK_VILLAGER_NAME',
}
export type TDialogConstants = {
    [EDialogConstant.VILLAGE_APOTHECARY_EXIST]: boolean;
    [EDialogConstant.VILLAGE_APOTHECARY_NAME]: string;
    [EDialogConstant.SICK_VILLAGER_EXIST]: boolean;
    [EDialogConstant.SICK_VILLAGER_NAME]: string;
};

export const DialogConstantsComponentID = 'DIALOG_CONSTANTS' as const;
export type DialogConstantsComponent = ReturnType<typeof createDialogConstantsComponent>;
export const createDialogConstantsComponent = () =>
    createComponent(DialogConstantsComponentID, <TDialogConstants>{
        [EDialogConstant.VILLAGE_APOTHECARY_EXIST]: false,
        [EDialogConstant.VILLAGE_APOTHECARY_NAME]: 'null',
        [EDialogConstant.SICK_VILLAGER_EXIST]: false,
        [EDialogConstant.SICK_VILLAGER_NAME]: 'null',
    });

export function setDialogConstants(
    struct: ExtractStruct<DialogConstantsComponent>,
    constants: Partial<TDialogConstants>,
): void {
    Object.assign(struct, constants);
}
