import { filter, fromEvent } from 'rxjs';

import {
    getComponentStruct,
    hasComponent,
    SomeEntity,
    tryGetComponentStruct,
} from '../../../lib/ECS/Entity';
import { addEntity, filterEntities, getEntities } from '../../../lib/ECS/Heap';
import { ActionableComponent, ActionableComponentID } from '../../Components/Actionable';
import { DialogComponentID, TDialogId } from '../../Components/Dialogs/Dialog';
import { DirectionComponentID } from '../../Components/DirectionComponent';
import { PersonComponentID, TPersonComponent } from '../../Components/Person';
import { PositionComponent, PositionComponentID } from '../../Components/Position';
import { createDialogEntity, DialogEntityID } from '../../Entities/Dilog';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { negateVector, sumVector, widthVector } from '../../utils/shape';

export enum CommonAction {
    None = 'None',
    Open = 'Open',
    Dialog = 'Dialog',
}

export function ActionSystem(heap: GameHeap): void {
    const player = getEntities(heap, PlayerEntityID)[0];
    const position = getComponentStruct(player, PositionComponentID);
    const direction = getComponentStruct(player, DirectionComponentID);

    fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(filter((e) => e.code === 'KeyE'))
        .subscribe(() => {
            const playerLookingAtPosition = sumVector(position, direction);
            const actionableEntities = filterEntities(
                heap,
                (e): e is SomeEntity<PositionComponent | ActionableComponent> => {
                    return (
                        hasComponent(e, PositionComponentID) &&
                        hasComponent(e, ActionableComponentID)
                    );
                },
            );

            actionableEntities.forEach((entity) => {
                const position = getComponentStruct(entity, PositionComponentID);
                const dist = widthVector(
                    sumVector(playerLookingAtPosition, negateVector(position)),
                );

                if (dist > 1) return;

                const action = getComponentStruct(entity, ActionableComponentID);

                if (action.type === CommonAction.Dialog) {
                    const person = tryGetComponentStruct<TPersonComponent>(
                        entity,
                        PersonComponentID,
                    );

                    addDialogEntity(heap, action.dialogID, person?.name ?? '');
                }
            });
        });
}

function addDialogEntity(heap: GameHeap, id: TDialogId, name: string): void {
    const dialogExist = getEntities(heap, DialogEntityID).some((dialog) => {
        const struct = getComponentStruct(dialog, DialogComponentID);
        return struct.id === id;
    });

    if (!dialogExist) {
        addEntity(heap, createDialogEntity({ id, speakers: ['You', name] }));
    }
}
