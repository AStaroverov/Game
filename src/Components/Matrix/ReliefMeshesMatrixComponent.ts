import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

import { Size } from '../../utils/shape';
import { MatrixComponent } from './MatrixComponent';

export class ReliefMeshesMatrixComponent extends MatrixComponent<
    Mesh<BoxGeometry, MeshBasicMaterial>
> {
    constructor({ w, h }: Size) {
        super({
            w,
            h,
            seed: () => {
                return new Mesh(
                    new BoxGeometry(),
                    new MeshBasicMaterial({
                        transparent: true,
                        alphaTest: 0.5,
                    }),
                );
            },
        });
    }
}
