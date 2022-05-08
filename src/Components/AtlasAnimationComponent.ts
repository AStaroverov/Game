import { Atlas, AtlasFrame } from '../../lib/Atlas';
import { floor } from '../utils/math';
import { AnimationComponent, AnimationProps } from './AnimationComponent';

export type AtlasAnimationProps = AnimationProps & {
    atlas: Atlas;
};

export class AtlasAnimationComponent extends AnimationComponent {
    atlas: Atlas;
    atlasFrame: AtlasFrame;

    constructor(props: AtlasAnimationProps) {
        super(props);
        this.atlas = props.atlas;
        this.atlasFrame = props.atlas.list[0];
    }
}

export function updateAtlasAnimation(
    component: AtlasAnimationComponent,
    delta: number,
): void {
    component.time += delta;

    const index =
        floor(component.time / component.duration) %
        component.atlas.list.length;

    component.atlasFrame = component.atlas.list[index];
}
