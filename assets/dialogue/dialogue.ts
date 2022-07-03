import { camelCase } from 'lodash';

import { deepMapKeys } from '../../lib/deepMapKeys';
import { ELang } from '../../src/Components/Lang';
import First_meet from './_First_meet.json';
import Look_at_backpack from './_Look_at_backpack.json';
import Some_villager from './_Some_villager.json';

export enum EDialogueName {
    'First_meet' = 'First_meet',
    'Look_at_backpack' = 'First Look_at_backpack',
    'Some_villager' = 'Some_villager',
}

export const dialogMap = {
    [EDialogueName['First_meet']]: deepMapKeys(First_meet[0], camelCase) as unknown as TDialog,
    [EDialogueName['Look_at_backpack']]: deepMapKeys(
        Look_at_backpack[0],
        camelCase,
    ) as unknown as TDialog,
    [EDialogueName['Some_villager']]: deepMapKeys(
        Some_villager[0],
        camelCase,
    ) as unknown as TDialog,
};

export type TNodeName = string;
export enum ENodeType {
    Start = 'start',
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
