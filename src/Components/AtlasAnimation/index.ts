import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { floor } from '../../utils/math';
import { createAnimationComponent } from '../AnimationComponent';
import { atlases, AtlasName } from './atlases';

export const AtlasAnimationComponentID = 'ATLAS_ANIMATION' as const;
export type AtlasAnimationComponent = ReturnType<
    typeof createAtlasAnimationComponent
>;
export const createAtlasAnimationComponent = (props: {
    time?: number;
    duration?: number;
    atlasName: AtlasName;
}) =>
    createComponent(
        AtlasAnimationComponentID,
        createAnimationComponent(props),
        {
            atlasName: props.atlasName,
            atlasFrame: 0,
        },
    );

export function updateAtlasAnimation(
    struct: ExtractStruct<AtlasAnimationComponent>,
    delta: number,
): void {
    struct.time += delta;
    struct.atlasFrame =
        floor(struct.time / struct.duration) %
        atlases[struct.atlasName].list.length;
}
