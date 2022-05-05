import { createComponent } from '../../lib/ECS/components';

export const Size = createComponent((size: { w: number; h: number }) => ({
    ...size,
}));
