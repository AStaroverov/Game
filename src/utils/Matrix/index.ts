import { Size } from '../shape';
import { copy, create, get, set, setSource } from './methods/base';
import { fromNestedArray } from './methods/from';
import {
    every,
    find,
    forEach,
    reduce,
    seed,
    slice,
    some,
} from './methods/iterators/base';
import { fill } from './methods/iterators/base';
import { map } from './methods/iterators/base';
import {
    matchReplace,
    matchReplaceAll,
    matchReplaceShuffle,
    matchReplaceShuffleAll,
} from './methods/matchReplace';
import { getSide } from './methods/side';
import {
    findSubMatrices,
    findSubMatrix,
    isSubMatrix,
} from './methods/submatrix';
import { toArray, toItemsArray, toNestedArray } from './methods/to';
import {
    flipX,
    flipY,
    getAllVariants,
    rotate,
    transpose,
} from './methods/transform';
import { STOP_ITERATE } from './methods/utils';

export type TMatrix<T = unknown> = Size & { buffer: T[] };
export type TMatrixSeed<T> = (x: number, y: number, i: number) => T;

export const Matrix = {
    create,
    seed,
    setSource,

    STOP_ITERATE,
    slice,
    forEach,
    reduce,
    find,
    some,
    every,
    fill,
    map,
    get,
    set,
    copy,

    fromNestedArray,

    toArray,
    toItemsArray,
    toNestedArray,

    transpose,
    flipX,
    flipY,
    rotate,

    isSubMatrix,
    findSubMatrix,
    findSubMatrices,

    getSide,

    getAllVariants,

    matchReplace,
    matchReplaceAll,
    matchReplaceShuffle,
    matchReplaceShuffleAll,
};
