import { createComponent } from '../../lib/ECS/Component';
import { getSeedDisease } from '../Definitions/Diseases/diseases';
import { getSeedSymptoms } from '../Definitions/Diseases/symptoms';
import { TSequence } from '../Definitions/Sequence/def';

export const WorldDiseasesComponentID = 'WORLD_DISEASES' as const;
export type WorldDiseasesComponent = ReturnType<typeof createWorldDiseasesComponent>;
export const createWorldDiseasesComponent = (sequences: TSequence[]) => {
    const symptoms = getSeedSymptoms(sequences);
    const disease = getSeedDisease(symptoms.list);

    return createComponent(WorldDiseasesComponentID, {
        symptoms: symptoms.list,
        disease: disease,
    });
};
