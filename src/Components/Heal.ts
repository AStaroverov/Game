import { createComponent } from '../../lib/ECS/Component';

export const HealComponentID = 'HEAL' as const;
export const createHealComponent = (max = 1, v: number = max) =>
    createComponent(HealComponentID, { v, max });
