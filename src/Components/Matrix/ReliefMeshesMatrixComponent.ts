import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

import { Size } from '../../utils/shape';
import { MatrixComponent } from './MatrixComponent';

export class ReliefMeshesMatrixComponent extends MatrixComponent<
    Mesh<PlaneGeometry, MeshBasicMaterial>
> {
    constructor({ w, h }: Size) {
        super({
            w,
            h,
            seed: () => {
                return new Mesh(
                    new PlaneGeometry(),
                    new MeshBasicMaterial({
                        transparent: true,
                        alphaTest: 0.5,
                    }),
                );
            },
        });
    }
}
