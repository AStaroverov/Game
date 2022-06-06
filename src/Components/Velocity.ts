import { createComponent, ExtractStruct } from '../../lib/ECS/Component';
import { abs, sign } from '../utils/math';
import {
    isEqualVectors,
    Vector,
    widthVector,
    zeroVector,
} from '../utils/shape';

export const VelocityComponentID = 'VELOCITY' as const;

export type VelocityComponent = ReturnType<typeof createVelocityComponent>;

// Rewrite velocity to vector value
export const createVelocityComponent = (v = 0) =>
    createComponent(VelocityComponentID, { v });

export function setVelocity(
    struct: ExtractStruct<VelocityComponent>,
    v: number,
): void {
    struct.v = v;
}

export function setVelocityByVector(
    struct: ExtractStruct<VelocityComponent>,
    direction: Vector,
): void {
    struct.v = isEqualVectors(direction, zeroVector)
        ? 0
        : widthVector(direction) /
          (sign(abs(direction.x)) + sign(abs(direction.y)));
}
