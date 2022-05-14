import { createComponentConstructor } from '../../lib/ECS/components';

export type AnimationComponent = {
    time: number;
    duration: number;
};

export const AnimationConstructor = createComponentConstructor(
    'AnimationComponent',
    (props: { duration?: number; time?: number }): AnimationComponent => {
        return {
            time: props.time ?? 0,
            duration: props.duration ?? 0,
        };
    },
);
