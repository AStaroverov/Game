import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { TILE_SIZE } from '../../CONST';
import { Size } from '../../utils/shape';
import { MatrixConstructor } from './Matrix';

export class SurfaceMeshesMatrixComponent extends MatrixConstructor<
    Mesh<PlaneGeometry, MeshLambertMaterial>
> {
    constructor({ w, h }: Size) {
        super({
            w,
            h,
            seed: () => {
                return new Mesh(
                    new PlaneGeometry(TILE_SIZE, TILE_SIZE),
                    new MeshLambertMaterial(),
                );
            },
        });
    }
}
