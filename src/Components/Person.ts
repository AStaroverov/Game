import { createComponent } from '../../lib/ECS/Component';
import { getRandomName } from '../utils/Person/getRandomName';
import { randomArbitraryInt, randomSign } from '../utils/random';

export enum ESex {
    male = 'male',
    female = 'female',
}

export type TPerson = {
    sex: ESex;
    name: string;
    age: number;
};

export const PersonComponentID = 'PERSON' as const;
export type TPersonComponent = ReturnType<typeof createPersonComponent>;
export const createPersonComponent = (props: TPerson) => createComponent(PersonComponentID, props);

export function getRandomPerson(): TPerson {
    return {
        sex: randomSign() > 0 ? ESex.male : ESex.female,
        name: getRandomName(),
        age: randomArbitraryInt(8, 100),
    };
}
