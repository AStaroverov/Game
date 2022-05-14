import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { Size } from '../../utils/shape';
import { MatrixConstructor } from './Matrix';

export class ReliefMeshesMatrixComponent extends MatrixConstructor<
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
