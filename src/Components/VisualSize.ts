import { createComponent } from '../../lib/ECS/Component';
import { TSize } from '../utils/shape';
import { createSizeComponent } from './Size';

export const VisualSizeComponentID = 'VISUAL_SIZE' as const;
export type VisualSizeComponent = ReturnType<typeof createVisualSizeComponent>;
export const createVisualSizeComponent = (size: TSize) =>
    createComponent(VisualSizeComponentID, createSizeComponent(size));
