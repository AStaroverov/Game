import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';

export const MeshComponentID = 'MESH' as const;
export type MeshStruct = ReturnStruct<typeof createMeshComponent>;
export type MeshComponent = ReturnType<typeof createMeshComponent>;
export const createMeshComponent = <
    G extends PlaneGeometry,
    M extends MeshLambertMaterial,
>(props: {
    geometry: G;
    material: M;
}) =>
    createComponent(MeshComponentID, {
        mesh: new Mesh(props.geometry, props.material),
    });
