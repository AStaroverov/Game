import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

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

        this.renderer.setSize(width, height);
        this.camera.position.z = 1000;

        ticker.addInterval(this.render, 1, { ctx: this });
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
