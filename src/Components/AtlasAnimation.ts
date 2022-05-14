import { Atlas, AtlasFrame } from '../../lib/Atlas';
import { createComponentConstructor } from '../../lib/ECS/components';
import { floor } from '../utils/math';
import { AnimationComponent, AnimationConstructor } from './AnimationComponent';

export type AtlasAnimationComponent = AnimationComponent & {
    atlas: Atlas;
    atlasFrame: AtlasFrame;
};

export const AtlasAnimationConstructor = createComponentConstructor(
    'AtlasAnimationComponent',
    (props: {
        duration?: number;
        time?: number;
        atlas: Atlas;
    }): AtlasAnimationComponent => {
        return {
            ...AnimationConstructor(props),
            atlas: props.atlas,
            atlasFrame: props.atlas.list[0],
        };
    },
);

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
