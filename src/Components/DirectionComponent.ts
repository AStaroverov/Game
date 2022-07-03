import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
import { TVector, Vector } from '../utils/shape';

export const DirectionComponentID = 'DIRECTION' as const;

export type DirectionComponent = ReturnType<typeof createDirectionComponent>;

export const createDirectionComponent = (props?: TVector) =>
    createComponent(DirectionComponentID, Vector.create(props?.x ?? 0, props?.y ?? 0));

export function setDirection(
    struct: ExtractStruct<DirectionComponent>,
    x: number,
    y: number,
): void {
    struct.x = x;
    struct.y = y;
}
