import { NearestFilter, Scene } from 'three';

import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { atlasPlayer, RenderPlayer } from '../RenderEntities/RenderPlayer';
import { newPoint, Point } from '../utils/shape';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export function playerRenderSystem(ticker: FrameTasks, scene: Scene): void {
    const renderPlayer = new RenderPlayer();
    scene.add(renderPlayer.mesh);

    movePlayer(
        renderPlayer,
        newPoint(
            Math.floor(RENDER_CARD_SIZE / 2) * TILE_SIZE,
            Math.floor(RENDER_CARD_SIZE / 2) * TILE_SIZE,
        ),
    );

    animatePlayer(ticker, renderPlayer);
}

function movePlayer(player: RenderPlayer, point: Point): void {
    player.mesh.position.x = point.x;
    player.mesh.position.y = point.y;
}

const frames = atlasPlayer.frames.map((frame) => {
    frame.texture.magFilter = NearestFilter;
    return frame;
});

function animatePlayer(
    ticker: FrameTasks,
    player: RenderPlayer,
    duration = 60,
): VoidFunction {
    let i = 0;
    const frameDuration = duration / frames.length;
    const stop = ticker.addInterval((delta) => {
        player.mesh.material.map = frames[i].texture;
        i = Math.floor(i + delta / frameDuration) % frames.length;
    }, 10);

    player.mesh.material.map = frames[0].texture;

    return () => {
        stop();
        player.mesh.material.map = frames[0].texture;
    };
}
