import { Group } from 'three';

import { createComponent } from '../../../lib/ECS/Component';

export const MeshGroupComponentID = 'MESH_GROUP' as const;
export type MeshGroupComponent = ReturnType<typeof createMeshGroupComponent>;
export const createMeshGroupComponent = () =>
    createComponent(MeshGroupComponentID, { object: new Group() });
