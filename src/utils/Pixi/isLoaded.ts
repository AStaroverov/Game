import { BaseTexture } from 'pixi.js';

export function isLoaded(base: BaseTexture): Promise<BaseTexture> {
    return new Promise((r) => {
        if (base.valid) r(base);
        else base.on('loaded', r);
    });
}
