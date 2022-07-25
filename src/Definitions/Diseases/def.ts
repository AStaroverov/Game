import { Opaque } from '../../types';
import { TSequence } from '../Sequence/def';

export type TDiseaseSymptomID = Opaque<'DiseaseSymptom', string>;
export type TDiseaseSymptom = {
    id: TDiseaseSymptomID;
    name: string;
    sequence: TSequence;
};

export type TDiseaseID = Opaque<'Disease', string>;
export type TDisease = {
    id: TDiseaseID;
    name: string;
    symptoms: TDiseaseSymptom[];
};
