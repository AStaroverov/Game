import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

export class MeshBasicComponent<
    G extends BoxGeometry = BoxGeometry,
    M extends MeshBasicMaterial = MeshBasicMaterial,
> {
    mesh: Mesh<G, M>;

    constructor(props: { geometry: G; material: M }) {
        this.mesh = new Mesh(props.geometry, props.material);
    }
}
