import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

export class MeshComponent<
    G extends PlaneGeometry = PlaneGeometry,
    M extends MeshBasicMaterial = MeshBasicMaterial,
> {
    object: Mesh<G, M>;

    constructor(props: { geometry: G; material: M }) {
        this.object = new Mesh(props.geometry, props.material);
    }
}
