import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { FrameTasks } from '../utils/TasksScheduler/frameTasks';

export class Renderer {
    scene = new Scene();
    camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    renderer = new WebGLRenderer();

    constructor(ticker: FrameTasks) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setPixelRatio(window.devicePixelRatio ?? 1);
        this.renderer.setSize(width, height);
        this.camera.position.z = 1000;
        this.scene.position.x -= (TILE_SIZE * RENDER_CARD_SIZE) / 2;
        this.scene.position.y -= (TILE_SIZE * RENDER_CARD_SIZE) / 2;

        ticker.addInterval(this.render, 1, this);
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
