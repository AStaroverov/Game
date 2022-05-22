import {
    filter,
    finalize,
    interval,
    map,
    takeUntil,
    takeWhile,
    tap,
} from 'rxjs';

import { getComponentStruct } from '../../lib/ECS/Entity';
import { deleteEntity, getEntities } from '../../lib/ECS/Heap';
import { dialogs } from '../Components/Dialogs/data';
import {
    DialogComponentID,
    updateDialogComponent,
} from '../Components/Dialogs/Dialog';
import {
    PlayerStoryComponentID,
    PlayerStoryStep,
    updatePlayerStoryStep,
} from '../Components/PlayerStoryProgress';
import { PositionComponentID } from '../Components/Position';
import { DialogEntity, DialogEntityID } from '../Entities/Dilog';
import { GameStoryEntityID } from '../Entities/GameStory';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { abs } from '../utils/math';
import { fromKeyPress } from '../utils/RX/keypress';
import {
    negateVector,
    newVector,
    setVector,
    sumVector,
    widthVector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

const startPosition = newVector(0, 0);
const ranDialogs = new Set<DialogEntity>();

export function runDialogSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const story = getEntities(heap, GameStoryEntityID)[0];
    const player = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(player, PositionComponentID);

    ticker.addTimeInterval(() => {
        const entity = getEntities(heap, DialogEntityID)[0];

        if (entity && !ranDialogs.has(entity)) {
            ranDialogs.add(entity);

            const dialog = getComponentStruct(entity, DialogComponentID);
            const dialogLength = dialogs[dialog.id].length;

            setVector(startPosition, playerPosition);

            fromKeyPress('Space')
                .pipe(
                    map(() => dialog.step + 1),
                    tap((step) => {
                        updateDialogComponent(dialog, { step });
                    }),
                    finalize(() => {
                        stopDialog(entity);

                        if (dialog.step >= dialogLength) {
                            updatePlayerStoryStep(
                                getComponentStruct(
                                    story,
                                    PlayerStoryComponentID,
                                ),
                                PlayerStoryStep.SearchFirstVillage,
                            );
                        }
                    }),
                    takeUntil(interval(300).pipe(filter(shouldStopByDistance))),
                    takeWhile((step) => step < dialogLength),
                )
                .subscribe();
        }
    }, 100);

    function shouldStopByDistance() {
        const width = abs(
            widthVector(sumVector(startPosition, negateVector(playerPosition))),
        );

        return width > 1;
    }

    function stopDialog(entity: DialogEntity) {
        ranDialogs.delete(entity);
        deleteEntity(heap, entity);
    }
}
