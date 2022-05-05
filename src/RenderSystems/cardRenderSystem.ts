import { Scene } from 'three';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import { PositionComponent } from '../Components/positionComponent';
import {
    getSlice,
    TilesComponent,
    TileType,
} from '../Components/TilesComponent';
import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { isCardEntity } from '../Entities/Card';
import { isPlayerEntity } from '../Entities/Player';
import { RenderTile } from '../RenderEntities/RenderTile';
import { Matrix } from '../utils/Matrix';
import { newPoint } from '../utils/shape';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function cardRenderSystem(
    ticker: FrameTasks,
    scene: Scene,
    heap: Heap,
): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const cardEntity = [...heap.getEntities(isCardEntity)][0];

    const playerPosition = getComponent(playerEntity, PositionComponent);
    const cardPosition = getComponent(cardEntity, PositionComponent);
    const cardTiles = getComponent(cardEntity, TilesComponent);

    const renderTiles: Matrix<RenderTile> = new Matrix(
        RENDER_CARD_SIZE,
        RENDER_CARD_SIZE,
        (x, y) =>
            new RenderTile({
                ...newPoint(x * TILE_SIZE, y * TILE_SIZE),
                size: TILE_SIZE,
                visible: false,
                type: TileType.empty,
            }),
    );

    const tick = () => {
        getSlice(
            cardTiles,
            playerPosition.x - cardPosition.x,
            playerPosition.y - cardPosition.y,
            Math.floor(RENDER_CARD_SIZE / 2),
        ).forEach((tile, x, y) => {
            const render = renderTiles.get(x, y);

            render?.update({
                visible: tile !== undefined,
                type: tile?.type,
            });
        });
    };

    renderTiles.forEach((item) => scene.add(item.mesh));
    ticker.addInterval(tick, 1);
}
