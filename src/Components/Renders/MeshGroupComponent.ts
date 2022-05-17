import { Group } from 'three';

import { createComponent, ReturnStruct } from '../../../lib/ECS/Component';

export const MeshGroupComponentID = 'MESH_GROUP' as const;
export type MeshGroupStruct = ReturnStruct<typeof createMeshGroupComponent>;
export type MeshGroupComponent = ReturnType<typeof createMeshGroupComponent>;
export const createMeshGroupComponent = () =>
    createComponent(MeshGroupComponentID, { group: new Group() });
