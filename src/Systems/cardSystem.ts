import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { moveTiles, TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { fillEnvironment } from '../Components/Matrix/TilesMatrix/fillers/fillEnvironment';
import { fillRoads } from '../Components/Matrix/TilesMatrix/fillers/fillRoads';
import { PositionComponentID } from '../Components/Position';
import { CENTER_CARD_POSITION } from '../CONST';
import { CardEntityID } from '../Entities/Card';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { ufloor } from '../utils/math';
import { mapVector, mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function cardSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const position = getComponentStruct(cardEntity, PositionComponentID);

    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(
        playerEntity,
        PositionComponentID,
    );

    ticker.addFrameInterval(moveCard, 1);

    function moveCard() {
        const playerPast = sumVector(
            playerPosition,
            mulVector(CENTER_CARD_POSITION, -1),
        );
        const cardDelta = sumVector(playerPast, position);
        const nextPosition = sumVector(position, mulVector(cardDelta, -1));

        const flooredPosition = mapVector(position, ufloor);
        const flooredNextPosition = mapVector(nextPosition, ufloor);
        const diff = sumVector(
            flooredPosition,
            mulVector(flooredNextPosition, -1),
        );

        if (diff.x !== 0 || diff.y !== 0) {
            moveTiles(cardTiles, diff);
            fillRoads(cardTiles);
            fillEnvironment(cardTiles);
        }

        setVector(position, nextPosition);
    }
}
