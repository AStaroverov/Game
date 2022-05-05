import { createComponent } from '../../lib/ECS/components';
import { newVector, Vector } from '../utils/shape';

export const Direction = createComponent((v: Vector = newVector(0, 0)) => ({
    ...v,
}));
