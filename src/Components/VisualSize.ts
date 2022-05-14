import {
    ComponentType,
    createComponentConstructor,
} from '../../lib/ECS/components';
import { Size } from '../utils/shape';
import { SizeConstructor } from './Size';

export type VisualSizeComponent = ComponentType<typeof VisualSizeConstructor>;

export const VisualSizeConstructor = createComponentConstructor(
    'VisualSizeConstructor',
    (size: Size) => SizeConstructor(size),
);
