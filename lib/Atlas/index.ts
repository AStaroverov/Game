import { maxBy } from 'lodash';
import { ImageLoader, Texture } from 'three';

type SpriteName = string;
type SpriteData = {
    frame: { x: number; y: number; w: number; h: number };
    rotated: boolean;
    trimmed: boolean;
    sourceSize: { w: number; h: number };
    spriteSourceSize: { x: number; y: number; w: number; h: number };
};
type AtlasData = {
    meta: {
        image: string;
        format: string; //'RGBA8888';
        size: { w: number; h: number };
        scale: string;
        smartupdate: string;
    };
    frames: Record<SpriteName, SpriteData>;
};

type Frame = {
    w: number;
    h: number;
    texture: Texture;
};

export class Atlas<D extends AtlasData> {
    w: number;
    h: number;
    frames: Frame[];

    constructor(url: string, data: D) {
        const spriteData = Object.entries(data.frames);

        this.w = getMax(spriteData, 'w');
        this.h = getMax(spriteData, 'h');
        this.frames = createFrames(spriteData, data.meta);

        new ImageLoader().load(url, (image) =>
            updateFramesImage(image, this.frames),
        );
    }
}

function getMax(entities: [SpriteName, SpriteData][], key: 'w' | 'h') {
    return maxBy(entities, ([, { frame }]) => frame[key])?.[1].frame[key] ?? 0;
}

function createFrames(
    entities: [SpriteName, SpriteData][],
    meta: AtlasData['meta'],
): Frame[] {
    return entities.map(([, { frame }]) => {
        const texture = new Texture();

        texture.repeat.x = frame.w / meta.size.w;
        texture.repeat.y = frame.h / meta.size.h;
        texture.offset.x = frame.x / meta.size.w;
        texture.offset.y = frame.y / meta.size.h;

        return { w: frame.w, h: frame.h, texture };
    });
}

function updateFramesImage(image: HTMLImageElement, frames: Frame[]) {
    frames.forEach((f) => {
        f.texture.image = image;
        f.texture.needsUpdate = true;
    });
}
