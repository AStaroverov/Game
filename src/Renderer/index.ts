import { OrthographicCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { CENTER_RENDER_POSITION, TILE_SIZE } from '../CONST';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

const min = Math.min(window.innerWidth, window.innerHeight) * 1.4;
const width = min;
const height = min;
const aspect = window.innerWidth / window.innerHeight;

export enum Layer {
    Main = 'Main',
    Fixed = 'Fixed',
}

export type Scenes = {
    [Layer.Main]: Scene;
    [Layer.Fixed]: Scene;
};

export type Renderers = {
    [Layer.Main]: WebGLRenderer;
    [Layer.Fixed]: WebGLRenderer;
};

export class Renderer {
    camera = new OrthographicCamera(
        (width * aspect) / -2,
        (width * aspect) / 2,
        height / 2,
        height / -2,
        0.1,
        1000,
    );

    scenes: Scenes = {
        [Layer.Main]: new Scene(),
        [Layer.Fixed]: new Scene(),
    };

    renderers: Renderers = {
        [Layer.Main]: new WebGLRenderer(),
        [Layer.Fixed]: new WebGLRenderer({ alpha: true }),
    };

    constructor(ticker: TasksScheduler) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const controls = new OrbitControls(this.camera, this.renderers[Layer.Fixed].domElement);
        controls.minDistance = 20;
        controls.maxDistance = 500;
        controls.enablePan = false;

        this.renderers[Layer.Main].setSize(width, height);
        this.renderers[Layer.Main].setPixelRatio(window.devicePixelRatio ?? 1);
        this.renderers[Layer.Fixed].setSize(width, height);
        this.renderers[Layer.Fixed].setPixelRatio(window.devicePixelRatio ?? 1);

        this.camera.zoom = 1.5;
        this.camera.position.z = 1000;
        this.camera.updateProjectionMatrix();

        this.scenes[Layer.Main].position.x -= TILE_SIZE * CENTER_RENDER_POSITION.x;
        this.scenes[Layer.Main].position.y -= TILE_SIZE * CENTER_RENDER_POSITION.y;

        ticker.addFrameInterval(this.render, 1, this);
    }

    private render(): void {
        this.renderers[Layer.Main].render(this.scenes[Layer.Main], this.camera);
        this.renderers[Layer.Fixed].render(this.scenes[Layer.Fixed], this.camera);
    }
}
