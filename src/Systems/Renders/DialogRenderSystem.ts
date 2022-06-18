import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { dialogs } from '../../Components/Dialogs/data';
import { DialogComponentID } from '../../Components/Dialogs/Dialog';
import { MeshComponentID, shouldInitMesh } from '../../Components/Renders/MeshComponent';
import { DialogEntityID, initDialogEntityMesh, setDialogText } from '../../Entities/Dilog';
import { GameHeap } from '../../heap';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function runDialogRenderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    let dialogStep = -1;

    ticker.addTimeInterval(() => {
        const entity = getEntities(heap, DialogEntityID)[0];

        if (entity) {
            const mesh = getComponentStruct(entity, MeshComponentID);
            const dialog = getComponentStruct(entity, DialogComponentID);

            if (shouldInitMesh(mesh)) {
                dialogStep = -1;
                initDialogEntityMesh(mesh);
            }

            if (dialogStep !== dialog.step) {
                const dialogDataStep = dialogs[dialog.id][(dialogStep = dialog.step)];

                setDialogText(entity, `${dialogDataStep.speaker}\n\n${dialogDataStep.content}`);
            }
        }
    }, 300);
}
