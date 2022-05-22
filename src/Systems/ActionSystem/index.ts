import { filter, fromEvent } from 'rxjs';

import {
    getComponentStruct,
    hasComponent,
    SomeEntity,
} from '../../../lib/ECS/Entity';
import { addEntity, filterEntities, getEntities } from '../../../lib/ECS/Heap';
import {
    ActionableComponent,
    ActionableComponentID,
} from '../../Components/Actionable';
import { DirectionComponentID } from '../../Components/DirectionComponent';
import {
    PositionComponent,
    PositionComponentID,
} from '../../Components/Position';
import { createDialogEntity } from '../../Entities/Dilog';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { negateVector, sumVector, widthVector } from '../../utils/shape';

export enum CommonAction {
    Open = 'Open',
    Dialog = 'Dialog',
}

export function runActionSystem(heap: GameHeap): void {
    const player = getEntities(heap, PlayerEntityID)[0];
    const position = getComponentStruct(player, PositionComponentID);
    const direction = getComponentStruct(player, DirectionComponentID);

    fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(filter((e) => e.code === 'KeyE'))
        .subscribe(() => {
            const playerLookingAtPosition = sumVector(position, direction);
            const actionableEntities = filterEntities(
                heap,
                (
                    e,
                ): e is SomeEntity<PositionComponent | ActionableComponent> => {
                    return (
                        hasComponent(e, PositionComponentID) &&
                        hasComponent(e, ActionableComponentID)
                    );
                },
            );

            actionableEntities.forEach((entity) => {
                const position = getComponentStruct(
                    entity,
                    PositionComponentID,
                );
                const dist = widthVector(
                    sumVector(playerLookingAtPosition, negateVector(position)),
                );

                if (dist > 1) return;

                const action = getComponentStruct(
                    entity,
                    ActionableComponentID,
                );

                if (action.type === CommonAction.Dialog) {
                    addEntity(
                        heap,
                        createDialogEntity({ id: action.dialogID }),
                    );
                }
            });
        });
}
