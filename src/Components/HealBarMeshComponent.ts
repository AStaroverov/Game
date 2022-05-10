import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { HEAL_BAR_Z } from '../CONST';
import { MeshGroupComponent } from './MeshGroupComponent';

export class HealBarMeshComponent extends MeshGroupComponent {
    healMesh = new Mesh(
        new PlaneGeometry(60, 6),
        new MeshLambertMaterial({
            transparent: true,
            color: 0xff0000,
            opacity: 0.7,
        }),
    );
    backgroundMesh = new Mesh<PlaneGeometry, MeshLambertMaterial>(
        new PlaneGeometry(64, 10),
        new MeshLambertMaterial({
            transparent: true,
            color: 0x000000,
            opacity: 0.3,
        }),
    );

    constructor() {
        super();

        this.object.position.z = HEAL_BAR_Z;
        this.healMesh.position.z = 2;
        this.backgroundMesh.position.z = 1;

        this.object.add(this.backgroundMesh, this.healMesh);
    }
}
