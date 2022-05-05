import { filter, fromEvent, map } from 'rxjs';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import {
    PositionComponent,
    positionMove,
} from '../Components/positionComponent';
import {
    getTile,
    TilesComponent,
    TileType,
} from '../Components/TilesComponent';
import { isCardEntity } from '../Entities/Card';
import { isPlayerEntity } from '../Entities/Player';

export function controlsSystem(heap: Heap): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const cardEntity = [...heap.getEntities(isCardEntity)][0];

    debugger;

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
                return [
                    e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0,
                    e.key === 'ArrowDown' ? -1 : e.key === 'ArrowUp' ? 1 : 0,
                ];
            }),
        )
        .subscribe(([x, y]) => {
            const playerPosition = getComponent(
                playerEntity,
                PositionComponent,
            );
            const cardPosition = getComponent(cardEntity, PositionComponent);
            const cardTiles = getComponent(cardEntity, TilesComponent);

            const tile = getTile(
                cardTiles,
                playerPosition.x - cardPosition.x + x,
                playerPosition.y - cardPosition.y + y,
            );

            if (tile?.type === TileType.passable) {
                positionMove(cardPosition, -x, -y);
                positionMove(playerPosition, x, y);
            }
        });
}
