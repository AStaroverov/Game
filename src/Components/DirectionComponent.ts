import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
import { newVector } from '../utils/shape';

export const DirectionComponentID = 'DIRECTION' as const;

export type DirectionComponent = ReturnType<typeof createDirectionComponent>;

export const createDirectionComponent = (x = 0, y = 0) =>
    createComponent(DirectionComponentID, newVector(x, y));

export function setDirection(
    struct: ExtractStruct<DirectionComponent>,
    x: number,
    y: number,
): void {
    struct.x = x;
    struct.y = y;
}
