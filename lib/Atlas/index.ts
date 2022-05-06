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
    frames: { [key: SpriteName]: SpriteData };
};

type Frame = {
    w: number;
    h: number;
    texture: Texture;
};

export class Atlas<D extends AtlasData, K extends keyof D['frames']> {
    w: number;
    h: number;
    map: Record<K, Frame>;
    list: Frame[];

    constructor(url: string, data: D) {
        const spriteData = Object.entries(data.frames);

        this.w = getMax(spriteData, 'w');
        this.h = getMax(spriteData, 'h');
        this.list = createFramesList(spriteData, data.meta);
        this.map = createFramesMap(spriteData, this.list) as Record<K, Frame>;

        new ImageLoader().load(url, (image) =>
            updateFramesImage(image, this.list),
        );
    }
}

function getMax<K>(entities: [K, SpriteData][], key: 'w' | 'h') {
    return maxBy(entities, ([, { frame }]) => frame[key])?.[1].frame[key] ?? 0;
}

function createFramesList<K>(
    entities: [K, SpriteData][],
    meta: AtlasData['meta'],
): Frame[] {
    return entities.map(([name, { frame }]) => {
        const texture = new Texture();

        texture.repeat.x = frame.w / meta.size.w;
        texture.repeat.y = frame.h / meta.size.h;
        texture.offset.x = 1 - texture.repeat.x - frame.x / meta.size.w;
        texture.offset.y = 1 - texture.repeat.y - frame.y / meta.size.h;

        return { name, w: frame.w, h: frame.h, texture };
    });
}

function createFramesMap(
    entities: [SpriteName, SpriteData][],
    list: Frame[],
): Record<string, Frame> {
    return list.reduce((acc, frame, i) => {
        acc[entities[i][0]] = frame;
        return acc;
    }, {} as Record<string, Frame>);
}

function updateFramesImage(image: HTMLImageElement, frames: Frame[]) {
    frames.forEach((f) => {
        f.texture.image = image;
        f.texture.needsUpdate = true;
    });
}
