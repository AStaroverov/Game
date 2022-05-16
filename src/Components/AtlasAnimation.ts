import { Atlas } from '../../lib/Atlas';
import { createComponent } from '../../lib/ECS/Component';
import { floor } from '../utils/math';
import { createAnimationComponent } from './AnimationComponent';

export const AtlasAnimationComponentID = 'ATLAS_ANIMATION' as const;
export type AtlasAnimationComponent = ReturnType<
    typeof createAtlasAnimationComponent
>;
export const createAtlasAnimationComponent = (props: {
    duration?: number;
    time?: number;
    atlas: Atlas;
}) =>
    createComponent(
        AtlasAnimationComponentID,
        createAnimationComponent(props),
        {
            atlas: props.atlas,
            atlasFrame: props.atlas.list[0],
        },
    );

export function updateAtlasAnimation(
    { body }: AtlasAnimationComponent,
    delta: number,
): void {
    body.time += delta;

    const index = floor(body.time / body.duration) % body.atlas.list.length;

    body.atlasFrame = body.atlas.list[index];
}
