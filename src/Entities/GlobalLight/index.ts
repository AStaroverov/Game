import { createEntity } from '../../../lib/ECS/Entity';
import { createAmbientLightMeshComponent } from '../../Components/Renders/LightComponent';

export const GlobalLightEntityID = 'GLOBAL_LIGHT_ENTITY' as const;
export type GlobalLightEntity = ReturnType<typeof createGlobalLightEntity>;
export const createGlobalLightEntity = () => {
    return createEntity(GlobalLightEntityID, [createAmbientLightMeshComponent()]);
};
