import { ECraftAction } from '../actions';
import { TCraftResourceDna } from '../resources';

const DNA_TRANSFORMS = {
    [ECraftAction.Dry]: (dna: TCraftResourceDna): TCraftResourceDna => ({
        ...dna,
        size: dna.size / 2,
    }),
    [ECraftAction.Grind]: (dna: TCraftResourceDna): TCraftResourceDna => ({
        ...dna,
        size: dna.size / 4,
    }),
    [ECraftAction.Squeeze]: (dna: TCraftResourceDna): TCraftResourceDna => ({
        ...dna,
        size: dna.size / 10,
    }),
};

export function transformDna(
    dna: TCraftResourceDna,
    action: Exclude<ECraftAction, ECraftAction.Mix>,
): TCraftResourceDna {
    return DNA_TRANSFORMS[action](dna);
}

export function mixDna(arr: TCraftResourceDna[]): TCraftResourceDna {
    return arr.reduce(
        (acc, dna) => {
            acc.size += dna.size / arr.length;
            acc.sequence += dna.sequence;
            return acc;
        },
        { size: 0, sequence: '' },
    );
}
