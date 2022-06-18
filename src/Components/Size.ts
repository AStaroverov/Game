import { createComponent } from '../../lib/ECS/Component';
import { TSize } from '../utils/shape';

export const SizeComponentID = 'SIZE' as const;
export const createSizeComponent = (size: TSize) => createComponent(SizeComponentID, { ...size });
