import { Atlas } from '../../lib/Atlas';
import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
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
    struct: ExtractStruct<AtlasAnimationComponent>,
    delta: number,
): void {
    struct.time += delta;

    const index =
        floor(struct.time / struct.duration) % struct.atlas.list.length;

    struct.atlasFrame = struct.atlas.list[index];
}
