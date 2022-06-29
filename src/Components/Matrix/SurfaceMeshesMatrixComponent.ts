import { Sprite } from 'pixi.js';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';
import { $ref } from '../../CONST';
import { TSize } from '../../utils/shape';
import { createMatrixComponent } from './Matrix';

export const SurfaceMeshesMatrixID = 'SURFACE_MESHES_MATRIX' as const;
export type SurfaceMeshesMatrixCell = {
    [$ref]: undefined | Sprite;
};
export type SurfaceMeshesMatrix = ReturnStruct<typeof createSurfaceMeshesMatrix>;

export const createSurfaceMeshesMatrix = (props: TSize) =>
    createComponent(SurfaceMeshesMatrixID, createMatrixComponent<SurfaceMeshesMatrixCell>(props));
