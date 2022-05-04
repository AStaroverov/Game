import { Scene } from 'three';

import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { Card, ETileType } from '../Entities/Card';
import { Player } from '../Entities/Player';
import { RenderTile } from '../RenderEntities/RenderTile';
import { Matrix } from '../utils/Matrix';
import { point } from '../utils/shape';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function cardRenderSystem(
    ticker: FrameTasks,
    scene: Scene,
    { card, player }: { card: Card; player: Player },
): void {
    const renderTiles: Matrix<RenderTile> = new Matrix(
        RENDER_CARD_SIZE,
        RENDER_CARD_SIZE,
        (x, y) =>
            new RenderTile({
                ...point(x * TILE_SIZE, y * TILE_SIZE),
                size: TILE_SIZE,
                visible: false,
                type: ETileType.empty,
            }),
    );

    const tick = () => {
        card.getSlice(
            player.x,
            player.y,
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
