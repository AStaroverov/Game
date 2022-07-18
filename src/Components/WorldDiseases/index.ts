import { createComponent } from '../../../lib/ECS/Component';

export const WorldDiseasesComponentID = 'WORLD_DISEASES' as const;
export type WorldDiseasesComponent = ReturnType<typeof createWorldDiseasesComponent>;
export const createWorldDiseasesComponent = () => {
    return createComponent(WorldDiseasesComponentID, {});
};
