import { createComponent } from '../../lib/ECS/Component';
import { newVector, TVector } from '../utils/shape';

export const PositionComponentID = 'POSITION' as const;
export type PositionComponent = ReturnType<typeof createPositionComponent>;
export const createPositionComponent = (props?: Partial<TVector>) =>
    createComponent(PositionComponentID, newVector(props?.x ?? 0, props?.y ?? 0));
