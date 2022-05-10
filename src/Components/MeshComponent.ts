import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

export class MeshComponent<
    G extends PlaneGeometry = PlaneGeometry,
    M extends MeshLambertMaterial = MeshLambertMaterial,
> {
    object: Mesh<G, M>;

    constructor(props: { geometry: G; material: M }) {
        this.object = new Mesh(props.geometry, props.material);
    }
}
