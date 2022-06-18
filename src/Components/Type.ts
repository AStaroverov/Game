import { createComponent } from '../../lib/ECS/Component';

export const TypeComponentID = 'TYPE' as const;
export type TypeComponent = ReturnType<typeof createTypeComponent>;
export const createTypeComponent = <T>(type: T) => createComponent(TypeComponentID, { type });
