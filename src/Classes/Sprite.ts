import { Texture } from '@pixi/core';
import { Sprite as Base } from 'pixi.js';

import { TVector } from '../utils/shape';

export class Sprite extends Base {
    constructor(texture?: Texture, props?: { anchor: TVector }) {
        super(texture);

        this.anchor.x = props?.anchor.x || 0.5;
        this.anchor.y = props?.anchor.y || 0.5;
    }
}
