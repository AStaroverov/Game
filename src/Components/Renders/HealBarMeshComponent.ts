import { createComponent, ExtractStruct } from '../../../lib/ECS/Component';
import { StageName } from '../../Renderer';
import { createMeshComponent } from './MeshComponent';

export const HealBarMeshComponentID = 'HEAL_BAR_MESH' as const;
export type HealBarMeshComponent = ReturnType<typeof createHealBarMeshComponent>;
export const createHealBarMeshComponent = () => {
    return createComponent(HealBarMeshComponentID, createMeshComponent({ layer: StageName.Main }));
};

export function initHealBarStruct(struct: ExtractStruct<HealBarMeshComponent>): void {
    // const group = new Group();
    // const healMesh = new Mesh(
    //     new PlaneGeometry(60, 6),
    //     new MeshLambertMaterial({
    //         transparent: true,
    //         color: 0xff0000,
    //         opacity: 0.7,
    //     }),
    // );
    // const backgroundMesh = new Mesh<PlaneGeometry, MeshLambertMaterial>(
    //     new PlaneGeometry(64, 10),
    //     new MeshLambertMaterial({
    //         transparent: true,
    //         color: 0x000000,
    //         opacity: 0.3,
    //     }),
    // );
    //
    // healMesh.position.z = 2;
    // backgroundMesh.position.z = 1;
    //
    // group.position.z = HEAL_BAR_Z;
    // group.add(backgroundMesh, healMesh);
    //
    // struct[$ref] = group;
}
