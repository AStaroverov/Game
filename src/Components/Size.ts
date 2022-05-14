import {
    ComponentType,
    createComponentConstructor,
} from '../../lib/ECS/components';
import { Size } from '../utils/shape';

export type SizeComponent = ComponentType<typeof SizeConstructor>;
export const SizeConstructor = createComponentConstructor(
    'SizeConstructor',
    (size: Size) => ({ ...size }),
);
