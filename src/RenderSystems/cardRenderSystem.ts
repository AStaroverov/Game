import { Scene } from 'three';

import { TILE_SIZE } from '../CONST';
import { Card } from '../Entities/Card';
import { Player } from '../Entities/Player';
import { RenderTile } from '../RenderEntities/RenderTile';
import { Matrix } from '../utils/matrix';
import { point } from '../utils/shape';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function cardRenderSystem(
    ticker: FrameTasks,
    scene: Scene,
    { card, player }: { card: Card; player: Player },
): void {
    const size = TILE_SIZE;
    const matrixSize = 10;
    const renderTiles: Matrix<RenderTile> = new Matrix(
        matrixSize,
        matrixSize,
        (x, y) =>
            new RenderTile({
                ...point(x * size, y * size),
                size,
                color: 0x000000,
                visible: false,
            }),
    );

    const tick = () => {
        console.log('>> -----');
        card.getSlice(player.x, player.y, 3).forEach((tile, x, y) => {
            console.log('>>', tile);
            const render = renderTiles.get(x, y);

            render.update({
                visible: tile !== undefined,
                color: tile.color,
            });
        });
    };

    renderTiles.forEach((item) => scene.add(item.mesh));
    ticker.addInterval(tick, 1);
}
