import { Scene } from 'three';

import { TILE_SIZE } from '../CONST';
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
            x: (player.x - card.offset.x) * TILE_SIZE,
            y: (player.y - card.offset.y) * TILE_SIZE,
        });
    };

    scene.add(renderPlayer.mesh);
    ticker.addInterval(tick, 1);
}
