import { Size } from '../shape';
import {
    copy,
    create,
    every,
    fill,
    find,
    forEach,
    get,
    map,
    reduce,
    seed,
    set,
    setSource,
    slice,
    some,
    toArray,
    toNestedArray,
} from './methods/base';
import { fromNestedArray } from './methods/from';
import { matchReplace, matchReplaceAll } from './methods/matchReplace';
import {
    findSubMatrices,
    findSubMatrix,
    isSubMatrix,
} from './methods/submatrix';
import {
    flipX,
    flipY,
    getAllVariants,
    rotate,
    transpose,
} from './methods/transform';
import { STOP_ITERATE, toItemsArray } from './methods/utils';

export type TMatrix<T = unknown> = Size & { buffer: T[] };
export type TMatrixSeed<T> = (x: number, y: number, i: number) => T;

export const Matrix = {
    create,
    seed,

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
    toArray,
    toItemsArray,
    toNestedArray,
    setSource,

    transpose,
    flipX,
    flipY,
    rotate,

    isSubMatrix,
    findSubMatrix,
    findSubMatrices,
    getAllVariants,

    matchReplace,
    matchReplaceAll,

    fromNestedArray,
};
