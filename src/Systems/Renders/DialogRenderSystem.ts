import { TDialogueNode } from '../../../assets/dialogue/dialogue';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { DialogComponentID } from '../../Components/Dialogs/Dialog';
import { LangComponentID } from '../../Components/Lang';
import { MeshComponentID, shouldInitMesh } from '../../Components/Renders/MeshComponent';
import { DialogEntityID, initRenderDialog, renderDialogNode } from '../../Entities/Dilog';
import { SettingsEntityID } from '../../Entities/Settings';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function DialogRenderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const settings = getEntities(heap, SettingsEntityID)[0];
    const lang = getComponentStruct(settings, LangComponentID);

    let prevNode: undefined | TDialogueNode;

    ticker.addTimeInterval(() => {
        const entity = getEntities(heap, DialogEntityID)[0];

        if (entity === undefined) return;

        const mesh = getComponentStruct(entity, MeshComponentID);
        const dialog = getComponentStruct(entity, DialogComponentID);

        if (shouldInitMesh(mesh)) {
            prevNode = undefined;
            initRenderDialog(mesh);
        }

        if (dialog.node && prevNode !== dialog.node) {
            prevNode = dialog.node;
            renderDialogNode(entity, dialog.speakers, dialog.node, lang.lang);
        }
    }, 100);
}
