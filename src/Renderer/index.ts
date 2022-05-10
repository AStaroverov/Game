import { OrthographicCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

const min = Math.min(window.innerWidth, window.innerHeight) * 1.4;
const width = min;
const height = min;
const aspect = window.innerWidth / window.innerHeight;

export class Renderer {
    scene = new Scene();
    // camera = new PerspectiveCamera(
    //     75,
    //     window.innerWidth / window.innerHeight,
    //     0.1,
    //     1000,
    // );
    camera = new OrthographicCamera(
        (width * aspect) / -2,
        (width * aspect) / 2,
        height / 2,
        height / -2,
    );
    renderer = new WebGLRenderer();

    constructor(ticker: TasksScheduler) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        controls.minDistance = 20;
        controls.maxDistance = 500;
        controls.enablePan = false;

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio ?? 1);
        this.camera.position.z = 1000;
        this.scene.position.x -= (TILE_SIZE * RENDER_CARD_SIZE) / 2;
        this.scene.position.y -= (TILE_SIZE * RENDER_CARD_SIZE) / 2;

        ticker.addFrameInterval(this.render, 1, this);
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
