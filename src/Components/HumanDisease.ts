import { createComponent } from '../../lib/ECS/Component';
import { TDiseaseID } from '../Definitions/Diseases/def';

export const HumanDiseaseComponentID = 'HUMAN_DISEASE' as const;
export type HumanDiseaseStruct = { diseaseId: undefined | TDiseaseID };
export type HumanDiseaseComponent = ReturnType<typeof createHumanDiseaseComponent>;
export const createHumanDiseaseComponent = (diseaseId: undefined | TDiseaseID) => {
    return createComponent(HumanDiseaseComponentID, <HumanDiseaseStruct>{
        diseaseId,
    });
};
