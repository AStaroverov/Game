import { filter, fromEvent, map } from 'rxjs';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import {
    DirectionComponent,
    setDirection,
} from '../Components/DirectionComponent';
import {
    PositionComponent,
    positionMove,
} from '../Components/PositionComponent';
import {
    getTile,
    TilesComponent,
    tilesFillEmpty,
    tilesMove,
    TileType,
} from '../Components/TilesComponent';
import { isCardEntity } from '../Entities/Card';
import { isPlayerEntity } from '../Entities/Player';
import { mulVector, newVector } from '../utils/shape';

export function controlsSystem(heap: Heap): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const cardEntity = [...heap.getEntities(isCardEntity)][0];

    const playerPosition = getComponent(playerEntity, PositionComponent);
    const playerDirection = getComponent(playerEntity, DirectionComponent);
    const cardPosition = getComponent(cardEntity, PositionComponent);
    const cardTiles = getComponent(cardEntity, TilesComponent);

    fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
            filter((e) => {
                return (
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowDown'
                );
            }),
            map((e) => {
                return newVector(
                    e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0,
                    e.key === 'ArrowDown' ? -1 : e.key === 'ArrowUp' ? 1 : 0,
                );
            }),
        )
        .subscribe((vector) => {
            const tile = getTile(
                cardTiles,
                playerPosition.x + cardPosition.x + vector.x,
                playerPosition.y + cardPosition.y + vector.y,
            );

            if (tile?.type === TileType.passable) {
                setDirection(playerDirection, vector);

                positionMove(playerPosition, vector);
                positionMove(cardPosition, mulVector(vector, -1));

                tilesMove(cardTiles, vector);
                tilesFillEmpty(cardTiles);
            }
        });
}
