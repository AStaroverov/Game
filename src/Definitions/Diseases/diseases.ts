import { uniq } from 'lodash';
import { map, pipe } from 'lodash/fp';

import { getRandomId, randomArbitraryInt } from '../../utils/random';
import { range } from '../../utils/range';
import { TDisease, TDiseaseID, TDiseaseSymptom } from './def';
import { getRandomDiseaseName } from './generateDiseaseName';

export const getSeedDisease = (symptoms: TDiseaseSymptom[]): TDisease[] => {
    return range(100).map(() =>
        createDisease({
            symptoms: selectSymptomsGroup(symptoms),
        }),
    );
};
export function createDisease(disease: Omit<TDisease, 'id' | 'name'>): TDisease {
    return {
        id: getRandomId() as TDiseaseID,
        name: getRandomDiseaseName(),
        ...disease,
    };
}

export function selectSymptomsGroup(symptoms: TDiseaseSymptom[]): TDiseaseSymptom[] {
    return pipe(
        map(() => symptoms[randomArbitraryInt(0, symptoms.length - 1)]),
        uniq,
    )(range(randomArbitraryInt(1, 6)));
}
