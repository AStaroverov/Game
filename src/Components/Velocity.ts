import {
    ComponentType,
    createComponentConstructor,
} from '../../lib/ECS/components';

export type VelocityComponent = ComponentType<typeof VelocityConstructor>;

export const VelocityConstructor = createComponentConstructor(
    'VelocityConstructor',
    (v = 0) => ({ v }),
);

export function setVelocity(component: VelocityComponent, v: number): void {
    component.v = v;
}
