import { fromEvent } from 'rxjs';

import { GameHeap } from '../heap';

export enum PlayerMainStoryAction {
    Next = 'Next',
}

export enum CommonAction {
    Open = 'Open',
}

export type QuestAction = PlayerMainStoryAction;
export type PlayerAction = CommonAction | PlayerMainStoryAction;

export function runActionSystem(heap: GameHeap): void {
    fromEvent(document, 'keypress').pipe().subscribe();
}
