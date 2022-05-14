import { createComponent } from '../../lib/ECS/Component';
import { Size } from '../utils/shape';
import { createSizeComponent } from './Size';

export const VisualSizeComponentID = 'VISUAL_SIZE' as const;
export type VisualSizeComponent = ReturnType<typeof createVisualSizeComponent>;
export const createVisualSizeComponent = (size: Size) =>
    createComponent(VisualSizeComponentID, createSizeComponent(size));
