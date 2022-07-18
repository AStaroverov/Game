import { firstValueFrom, mapTo, merge } from 'rxjs';

import { dialogMap, ENodeType, TDialogueNode } from '../../assets/dialogue/dialogue';
import { getComponentStruct } from '../../lib/ECS/Entity';
import { deleteEntity, getEntities } from '../../lib/ECS/Heap';
import { DialogComponentID, setDialogNode } from '../Components/Dialogs/Dialog';
import {
    DialogConstantsComponentID,
    EDialogConstant,
    TDialogConstants,
} from '../Components/Dialogs/DialogConstants';
import { PositionComponentID } from '../Components/Position';
import { DialogEntity, DialogEntityID } from '../Entities/Dilog';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { booleanToString } from '../utils/booleanToString';
import { iterateDialog } from '../utils/dialogue';
import { fromKeyUp } from '../utils/RX/keypress';
import { TVector, Vector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';
import { throwingError } from '../utils/throwingError';

const ranDialogs = new Set<DialogEntity>();

export function DialogSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const player = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(player, PositionComponentID);

    ticker.addTimeInterval(async () => {
        const dialogs = getEntities(heap, DialogEntityID);

        if (dialogs.length === 0) return;
        if (ranDialogs.has(dialogs[0])) return;

        ranDialogs.add(dialogs[0]);
        await Promise.race([runDialog(dialogs[0]), isGoAway(ticker, playerPosition)]);
        ranDialogs.delete(dialogs[0]);
        deleteEntity(heap, dialogs[0]);
    }, 100);
}

async function runDialog(entity: DialogEntity) {
    const dialog = getComponentStruct(entity, DialogComponentID);
    const constants = getComponentStruct(entity, DialogConstantsComponentID);
    const dialogData = dialogMap[dialog.id];

    const dialogIterator = iterateDialog(dialogData.nodes);
    let step = dialogIterator.next();
    let node: undefined | TDialogueNode;
    let nodeName: undefined | string;

    while (!step.done) {
        node = step.value!;

        while (node.nodeType === ENodeType.ConditionBranch) {
            const result = executeCondition(node.text, constants);

            step = dialogIterator.next(node.branches[booleanToString(result)]);
            node = step.value!;
        }

        setDialogNode(dialog, node);

        if (node.nodeType === ENodeType.ShowMessage) {
            if (node.choices !== undefined) {
                const choice = await firstValueFrom(
                    merge(
                        ...node.choices.map((choice, i) =>
                            fromKeyUp(`Digit${i + 1}`).pipe(mapTo(choice)),
                        ),
                    ),
                );
                nodeName = choice.next;
            } else {
                await firstValueFrom(fromKeyUp('Space'));
                nodeName = node.next;
            }
        }

        step = dialogIterator.next(nodeName);
    }
}

async function isGoAway(ticker: TasksScheduler, playerPosition: TVector): Promise<void> {
    const startPlayerPosition = Vector.copy(playerPosition);

    return new Promise((resolve) => {
        ticker.addFrameInterval(
            () => Vector.distance(startPlayerPosition, playerPosition) > 1 && resolve(),
            5,
        );
    });
}

function executeCondition(_code: string, constants: TDialogConstants): boolean {
    const code = _code.replaceAll(/\{\{(.+)\}\}/g, (_, key) => {
        return key in constants
            ? constants[key as EDialogConstant]
            : throwingError(`No existed variable in dialog: ${key}`);
    });
    return eval(code);
}
