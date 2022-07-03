import { EDialogueName, TDialogueMessageNode } from '../../../assets/dialogue/dialogue';
import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';

export type TDialogId = EDialogueName;

export const DialogComponentID = 'DIALOG' as const;
export type DialogComponent = ReturnType<typeof createDialogComponent>;
export const createDialogComponent = (props: {
    id: TDialogId;
    speakers: string[];
    node?: TDialogueMessageNode;
}) => createComponent(DialogComponentID, { ...props });

export function setDialogSpeakers(
    struct: ExtractStruct<DialogComponent>,
    speakers: string[],
): void {
    struct.speakers = speakers;
}

export function setDialogNode(
    struct: ExtractStruct<DialogComponent>,
    node: TDialogueMessageNode,
): void {
    struct.node = node;
}
