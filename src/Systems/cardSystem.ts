import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { moveTiles, TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { updateEnvironment } from '../Components/Matrix/TilesMatrix/fillers/environment';
import { updateRoads } from '../Components/Matrix/TilesMatrix/fillers/roads';
import { spawnVillage } from '../Components/Matrix/TilesMatrix/fillers/village';
import { PositionComponentID } from '../Components/Position';
import { CENTER_CARD_POSITION } from '../CONST';
import { CardEntityID } from '../Entities/Card';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { floor } from '../utils/math';
import { mapVector, mulVector, setVector, sumVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function cardSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

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

        const cardDelta = sumVector(playerPast, cardPosition);
        const nextCardPosition = sumVector(
            cardPosition,
            mulVector(cardDelta, -1),
        );

        const flooredPosition = mapVector(cardPosition, floor);
        const flooredNextPosition = mapVector(nextCardPosition, floor);
        const diff = sumVector(
            flooredPosition,
            mulVector(flooredNextPosition, -1),
        );

        if (diff.x !== 0 || diff.y !== 0) {
            moveTiles(cardTiles, diff);
            updateRoads(cardTiles.matrix, diff);
            updateEnvironment(cardTiles.matrix, diff);

            spawnVillage(cardTiles.matrix, diff);
        }

        setVector(cardPosition, nextCardPosition);
    }
}
