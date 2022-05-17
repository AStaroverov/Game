import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { createComponent, getStruct } from '../../../lib/ECS/Component';
import { HEAL_BAR_Z } from '../../CONST';
import { createMeshGroupComponent } from './MeshGroupComponent';

export const HealBarMeshComponentID = 'HEAL_BAR_MESH' as const;
export type HealBarMeshComponent = ReturnType<
    typeof createHealBarMeshComponent
>;
export const createHealBarMeshComponent = () => {
    const groupComponent = createMeshGroupComponent();
    const healMesh = new Mesh(
        new PlaneGeometry(60, 6),
        new MeshLambertMaterial({
            transparent: true,
            color: 0xff0000,
            opacity: 0.7,
        }),
    );
    const backgroundMesh = new Mesh<PlaneGeometry, MeshLambertMaterial>(
        new PlaneGeometry(64, 10),
        new MeshLambertMaterial({
            transparent: true,
            color: 0x000000,
            opacity: 0.3,
        }),
    );

    healMesh.position.z = 2;
    backgroundMesh.position.z = 1;

    getStruct(groupComponent).group.position.z = HEAL_BAR_Z;
    getStruct(groupComponent).group.add(backgroundMesh, healMesh);

    return createComponent(HealBarMeshComponentID, groupComponent, {
        healMesh,
        backgroundMesh,
    });
};
