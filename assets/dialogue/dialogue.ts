import { camelCase } from 'lodash';

import { deepMapKeys } from '../../lib/deepMapKeys';
import { ELang } from '../../src/Components/Lang';
import First_meet from './_First_meet.json';
import Look_at_backpack from './_Look_at_backpack.json';
import Seek_human from './_Seek_human.json';
import Some_villager from './_Some_villager.json';

export enum EDialogueName {
    'First_meet' = 'First_meet',
    'Look_at_backpack' = 'First Look_at_backpack',
    'Some_villager' = 'Some_villager',
    'Seek_human' = 'Seek_human',
}

export const dialogMap: Record<EDialogueName, TDialog> = {
    [EDialogueName['First_meet']]: prepareDialog(First_meet),
    [EDialogueName['Look_at_backpack']]: prepareDialog(Look_at_backpack),
    [EDialogueName['Some_villager']]: prepareDialog(Some_villager),
    [EDialogueName['Seek_human']]: prepareDialog(Seek_human),
};

export type TNodeName = string;
export enum ENodeType {
    Start = 'start',
    // Доделать выполнимые диологи
    Execute = 'execute',
    ShowMessage = 'show_message',
    ConditionBranch = 'condition_branch',
}
export enum ECharacter {
    Player = 'Player',
    Stranger = 'Stranger',
    Villager = 'Villager',
}

export type TText = Record<ELang, string>;
export type TChoice = {
    condition: string;
    isCondition: boolean;
    next: string;
    text: TText;
};
export type TDialogueStartNode = {
    nodeType: ENodeType.Start;
    nodeName: 'START';
    next: TNodeName;
};
export type TDialogueMessageNode = {
    nodeType: ENodeType.ShowMessage;
    nodeName: TNodeName;
    character: [ECharacter, number];
    text?: TText;
    next?: TNodeName;
    choices?: TChoice[];
};
export type TDialogueBranchNode = {
    nodeType: ENodeType.ConditionBranch;
    nodeName: TNodeName;
    character: [ECharacter, number];
    text: string;
    branches: {
        false?: TNodeName;
        true?: TNodeName;
    };
};
export type TDialogueNode = TDialogueMessageNode | TDialogueBranchNode;
export type TDialogueNodes = (TDialogueStartNode | TDialogueNode)[];
export type TDialog = {
    nodes: TDialogueNodes;
};

function prepareDialog(json: any): TDialog {
    return deepMapKeys(camelCase)(json[0]) as TDialog;
}
