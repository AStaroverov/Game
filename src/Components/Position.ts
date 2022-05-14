import { createComponent } from '../../lib/ECS/Component';
import { Vector } from '../utils/shape';

export const PositionID = 'POSITION' as const;
export type Position = ReturnType<typeof createPosition>;
export const createPosition = (props?: Partial<Vector>) =>
    createComponent(PositionID, { x: props?.x ?? 0, y: props?.y ?? 0 });
