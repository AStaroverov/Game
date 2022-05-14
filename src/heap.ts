import { createHeap } from '../lib/ECS/Heap';
import { createCardEntity } from './Entities/Card';

export const heap = createHeap([createCardEntity]);
