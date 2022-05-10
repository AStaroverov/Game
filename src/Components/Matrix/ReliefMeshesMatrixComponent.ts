import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { Size } from '../../utils/shape';
import { MatrixComponent } from './MatrixComponent';

export class ReliefMeshesMatrixComponent extends MatrixComponent<
    Mesh<PlaneGeometry, MeshLambertMaterial>
> {
    constructor({ w, h }: Size) {
        super({
            w,
            h,
            seed: () => {
                return new Mesh(
                    new PlaneGeometry(),
                    new MeshLambertMaterial({
                        transparent: true,
                        alphaTest: 0.5,
                    }),
                );
            },
        });
    }
}
