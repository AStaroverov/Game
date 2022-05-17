import { createComponent, ExtractStruct } from '../../lib/ECS/Component';

export const VelocityComponentID = 'VELOCITY' as const;

export type VelocityComponent = ReturnType<typeof createVelocityComponent>;

export const createVelocityComponent = (v = 0) =>
    createComponent(VelocityComponentID, { v });

export function setVelocity(
    struct: ExtractStruct<VelocityComponent>,
    v: number,
): void {
    struct.v = v;
}
