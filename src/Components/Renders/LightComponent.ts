import { Light, SpotLight } from 'three';

export class LightMeshComponent<L extends Light> {
    object: L;

    constructor(object: L) {
        this.object = object;
    }
}

export class SpotLightMeshComponent extends LightMeshComponent<SpotLight> {}
