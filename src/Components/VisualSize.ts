import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
import { Size, TSize } from '../utils/shape';
import { createSizeComponent } from './Size';

export const VisualSizeComponentID = 'VISUAL_SIZE' as const;
export type VisualSizeComponent = ReturnType<typeof createVisualSizeComponent>;
export const createVisualSizeComponent = (size: TSize) =>
    createComponent(VisualSizeComponentID, createSizeComponent(size));

export const setVisualSize = (struct: ExtractStruct<VisualSizeComponent>, size: TSize): TSize => {
    return Size.set(struct, size);
};
