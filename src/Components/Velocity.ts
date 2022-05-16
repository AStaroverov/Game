import { createComponent } from '../../lib/ECS/Component';

export const VelocityComponentID = 'VELOCITY' as const;

export type VelocityComponent = ReturnType<typeof createVelocityComponent>;

export const createVelocityComponent = (v = 0) =>
    createComponent(VelocityComponentID, { v });

export function setVelocity(body: VelocityComponent['body'], v: number): void {
    body.v = v;
}
