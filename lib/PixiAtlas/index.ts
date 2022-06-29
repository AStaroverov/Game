import { ISpritesheetData } from '@pixi/spritesheet';
import { keyBy } from 'lodash';
import { BaseTexture, Spritesheet, Texture } from 'pixi.js';

type AtlasData = ISpritesheetData;

export type AtlasFrame = {
    x: number;
    y: number;
    w: number;
    h: number;
    name: string;
    texture: Texture;
};

export class PixiAtlas<
    D extends AtlasData = AtlasData,
    K extends keyof D['frames'] = keyof D['frames'],
> {
    map: Record<K, AtlasFrame>;
    list: AtlasFrame[];

    constructor(url: string, data: D) {
        const spritesheet = new Spritesheet(new BaseTexture(url), data);
        spritesheet.parse((textures) => {
            // for (const texture in textures) {
            //     textures[texture].defaultAnchor.set(0.5, 0.5);
            //     }
        });
        const frames = Object.entries(spritesheet.textures).map(([name, texture]) => {
            return { ...data.frames[name].frame, name, texture };
        });

        this.list = frames;
        this.map = keyBy(frames, 'name') as Record<K, AtlasFrame>;
    }
}
