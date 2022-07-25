import { uniq } from 'lodash';
import { map, pipe } from 'lodash/fp';

import { getRandomChar } from '../../utils/random';
import { range } from '../../utils/range';
import { ECraftAction } from '../Craft';
import { TSequence } from './def';

const SEQUENCE_TRANSFORMS = {
    [ECraftAction.Dry]: (s: TSequence): TSequence => <TSequence>(s + s),
    [ECraftAction.Grind]: (s: TSequence): TSequence =>
        <TSequence>(s + s.split('').reverse().join('')),
    [ECraftAction.Squeeze]: (s: TSequence): TSequence => <TSequence>(s +
            s
                .split('')
                .map((c) => c + c)
                .join('')),
};

export function transformSequence(
    dna: TSequence,
    action: Exclude<ECraftAction, ECraftAction.Mix>,
): TSequence {
    return SEQUENCE_TRANSFORMS[action](dna);
}

export function mixSequences(arr: TSequence[]): TSequence {
    return arr.reduce((acc, sequence) => <TSequence>(acc + sequence), '' as TSequence);
}

export const getRandomSequence = () => range(3).map(getRandomChar).join('') as TSequence;

const mapToRandomSequence = pipe(map(getRandomSequence), uniq);
export const getRandomSequences = (l: number) => mapToRandomSequence(range(l));
