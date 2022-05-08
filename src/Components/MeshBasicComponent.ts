import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

export class MeshBasicComponent<
    G extends PlaneGeometry = PlaneGeometry,
    M extends MeshBasicMaterial = MeshBasicMaterial,
> {
    mesh: Mesh<G, M>;

    constructor(props: { geometry: G; material: M }) {
        this.mesh = new Mesh(props.geometry, props.material);
    }
}
