import { maxBy } from 'lodash';
import { ImageLoader, Source, Texture } from 'three';

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
        smartupdate?: string;
    };
    frames: { [key: SpriteName]: SpriteData };
};

export type AtlasFrame = { x: number; y: number; w: number; h: number; texture: Texture };

export class Atlas<
    D extends AtlasData = AtlasData,
    K extends keyof D['frames'] = keyof D['frames'],
> {
    w: number;
    h: number;
    map: Record<K, AtlasFrame>;
    list: AtlasFrame[];

    constructor(url: string, data: D) {
        const spriteData = Object.entries(data.frames);

        this.w = getMax(spriteData, 'w');
        this.h = getMax(spriteData, 'h');
        this.list = createFramesList(spriteData, data.meta);
        this.map = createFramesMap(spriteData, this.list) as Record<K, AtlasFrame>;

        new ImageLoader().load(url, (image) => {
            updateFramesImage(this.list, new Source(image));
        });
    }
}

function getMax<K>(entities: [K, SpriteData][], key: 'w' | 'h') {
    return maxBy(entities, ([, { frame }]) => frame[key])?.[1].frame[key] ?? 0;
}

function createFramesList<K>(entities: [K, SpriteData][], meta: AtlasData['meta']): AtlasFrame[] {
    return entities.map(([name, { frame }]) => {
        const texture = new Texture();

        texture.repeat.x = frame.w / meta.size.w;
        texture.repeat.y = frame.h / meta.size.h;
        texture.offset.x = frame.x / meta.size.w;
        texture.offset.y = 1 - texture.repeat.y - frame.y / meta.size.h;

        return { name, texture, ...frame };
    });
}

function createFramesMap(
    entities: [SpriteName, SpriteData][],
    list: AtlasFrame[],
): Record<string, AtlasFrame> {
    return list.reduce((acc, frame, i) => {
        acc[entities[i][0]] = frame;
        return acc;
    }, {} as Record<string, AtlasFrame>);
}

function updateFramesImage(frames: AtlasFrame[], source: Source) {
    frames.forEach((f) => {
        f.texture.source = source;
        f.texture.needsUpdate = true;
    });
}
