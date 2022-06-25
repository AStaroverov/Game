import { createComponent } from '../../lib/ECS/Component';
import { TSize } from '../utils/shape';

export const ColliderComponentID = 'COLLIDER' as const;
export type ColliderComponent = ReturnType<typeof createColliderComponent>;
export const createColliderComponent = (size: TSize) => createComponent(ColliderComponentID, size);
