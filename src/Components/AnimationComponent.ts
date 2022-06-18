import { createComponent } from '../../lib/ECS/Component';

export const AnimationComponentID = 'ANIMATION' as const;
export type AnimationComponent = ReturnType<typeof createAnimationComponent>;
export const createAnimationComponent = (props: { duration?: number; time?: number }) =>
    createComponent(AnimationComponentID, {
        time: props.time ?? 0,
        duration: props.duration ?? 0,
    });
