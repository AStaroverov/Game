import { createComponent } from '../../lib/ECS/Component';
import { Size } from '../utils/shape';

export const SizeComponentID = 'SIZE' as const;
export const createSizeComponent = (size: Size) =>
    createComponent(SizeComponentID, { ...size });
