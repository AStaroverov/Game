import { createComponentConstructor } from '../../lib/ECS/components';

export const HealConstructor = createComponentConstructor(
    'HealConstructor',
    (max = 1, v: number = max) => {
        return { v, max };
    },
);
