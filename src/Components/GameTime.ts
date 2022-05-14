import { createComponentConstructor } from '../../lib/ECS/components';

export const GameTimeConstructor = createComponentConstructor(
    'GameTimeConstructor',
    (time = 1) => {
        return { time };
    },
);
