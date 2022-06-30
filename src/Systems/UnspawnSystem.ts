import { getComponentStruct, hasComponent, SomeEntity } from '../../lib/ECS/Entity';
import { deleteEntity, filterEntities, getEntities } from '../../lib/ECS/Heap';
import {
    AutoUnspawnableComponent,
    AutoUnspawnableComponentID,
    UnspawnReason,
} from '../Components/AutoRemovable';
import { PositionComponent, PositionComponentID } from '../Components/Position';
import { CENTER_CARD_POSITION, HALF_CARD_SIZE, HALF_RENDER_CARD_SIZE } from '../CONST';
import { CardEntityID } from '../Entities/Card';
import { GameHeap } from '../heap';
import { abs } from '../utils/math';
import { mulVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function UnspawnSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    ticker.addTimeInterval(update, 1000);

    function update() {
        const entities = filterEntities(
            heap,
            (e): e is SomeEntity<PositionComponent | AutoUnspawnableComponent> => {
                return (
                    hasComponent(e, PositionComponentID) &&
                    hasComponent(e, AutoUnspawnableComponentID)
                );
            },
        );

        for (const entity of entities) {
            const position = getComponentStruct(entity, PositionComponentID);
            const unspawn = getComponentStruct(entity, AutoUnspawnableComponentID);

            if (unspawn.reasons === undefined) continue;

            const diff = sumVector(position, mulVector(CENTER_CARD_POSITION, -1), cardPosition);
            const dist = getDistance(unspawn.reasons);

            if (dist && (abs(diff.x) > HALF_CARD_SIZE || abs(diff.y) > HALF_CARD_SIZE)) {
                deleteEntity(heap, entity);
            }
        }
    }
}

function getDistance(reasons: UnspawnReason[]): void | number {
    if (reasons.some((r) => r === UnspawnReason.OutOfCard)) {
        return HALF_CARD_SIZE;
    }

    if (reasons.some((r) => r === UnspawnReason.OutOfRender)) {
        return HALF_RENDER_CARD_SIZE;
    }

    return undefined;
}
