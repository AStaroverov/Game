import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

import { TILE_SIZE } from '../../CONST';
import { Size } from '../../utils/shape';
import { MatrixComponent } from './MatrixComponent';

export class SurfaceMeshesMatrixComponent extends MatrixComponent<
    Mesh<PlaneGeometry, MeshBasicMaterial>
> {
    constructor({ w, h }: Size) {
        super({
            w,
            h,
            seed: () => {
                return new Mesh(
                    new PlaneGeometry(TILE_SIZE, TILE_SIZE),
                    new MeshBasicMaterial(),
                );
            },
        });
    }
}
