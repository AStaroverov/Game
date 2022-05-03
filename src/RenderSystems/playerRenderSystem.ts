import { Scene } from 'three';

import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { Card } from '../Entities/Card';
import { Player } from '../Entities/Player';
import { RenderPlayer } from '../RenderEntities/RenderPlayer';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function playerRenderSystem(
    ticker: FrameTasks,
    scene: Scene,
    { card, player }: { card: Card; player: Player },
): void {
    const renderPlayer = new RenderPlayer({ x: 0, y: 0 });
    const tick = () => {
        renderPlayer.update({
            x: Math.floor(RENDER_CARD_SIZE / 2) * TILE_SIZE,
            y: Math.floor(RENDER_CARD_SIZE / 2) * TILE_SIZE,
        });
    };

    scene.add(renderPlayer.mesh);
    ticker.addInterval(tick, 1);
}
