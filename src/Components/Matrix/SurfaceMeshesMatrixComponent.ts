import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

import { TILE_SIZE } from '../../CONST';
import { Size } from '../../utils/shape';
import { MatrixComponent } from './MatrixComponent';

export class SurfaceMeshesMatrixComponent extends MatrixComponent<
    Mesh<BoxGeometry, MeshBasicMaterial>
> {
    constructor({ w, h }: Size) {
        super({
            w,
            h,
            seed: () => {
                return new Mesh(
                    new BoxGeometry(TILE_SIZE, TILE_SIZE),
                    new MeshBasicMaterial(),
                );
            },
        });
    }
}
