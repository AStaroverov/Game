import { createComponent } from '../../lib/ECS/Component';
import { newVector, Vector } from '../utils/shape';

export const PositionComponentID = 'POSITION' as const;
export type PositionComponent = ReturnType<typeof createPositionComponent>;
export const createPositionComponent = (props?: Partial<Vector>) =>
    createComponent(
        PositionComponentID,
        newVector(props?.x ?? 0, props?.y ?? 0),
    );
