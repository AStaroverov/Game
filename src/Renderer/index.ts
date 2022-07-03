import { Renderer as PixiRenderer } from '@pixi/core';
import { Container, SCALE_MODES, settings } from 'pixi.js';

import { RENDER_RECT, TILE_SIZE } from '../CONST';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

export enum StageName {
    Main = 'Main',
    Fixed = 'Fixed',
}

export type Stages = {
    [StageName.Main]: Container;
    [StageName.Fixed]: Container;
};

export type Renderers = {
    [StageName.Main]: PixiRenderer;
    [StageName.Fixed]: PixiRenderer;
};

export class Renderer {
    scenes: Stages = {
        [StageName.Main]: new Container(),
        [StageName.Fixed]: new Container(),
    };

    renderers: Renderers = {
        [StageName.Main]: new PixiRenderer({ resolution: window.devicePixelRatio }),
        [StageName.Fixed]: new PixiRenderer({
            resolution: window.devicePixelRatio,
            backgroundAlpha: 0,
        }),
    };

    render(): void {
        this.resize(this.renderers[StageName.Main]);
        this.resize(this.renderers[StageName.Fixed]);

        this.setAtCenter(StageName.Main);

        this.renderers[StageName.Main].render(this.scenes[StageName.Main]);
        this.renderers[StageName.Fixed].render(this.scenes[StageName.Fixed]);
    }

    resize(renderer: PixiRenderer) {
        renderer.resize(renderer.view.offsetWidth, renderer.view.offsetHeight);
    }

    setAtCenter(layer: StageName) {
        const renderer = this.renderers[layer];
        const scene = this.scenes[layer];

        scene.position.x = renderer.screen.width / 2 - (TILE_SIZE * RENDER_RECT.w) / 2 + TILE_SIZE;
        scene.position.y = renderer.screen.height / 2 - (TILE_SIZE * RENDER_RECT.h) / 2 + TILE_SIZE;
    }
}
