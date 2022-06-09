import { Matrix, TMatrix, TMatrixSeed } from '../index';
import { getItem, Item, STOP_ITERATE } from './utils';

export function create<T>(
    w: number,
    h: number,
    filler?: TMatrixSeed<T>,
): TMatrix<T> {
    const buffer = new Array(w * h).fill(null);
    const instance = { w, h, buffer };

    if (filler) {
        seed(instance, filler);
    }

    return instance;
}

export function slice<T>(
    matrix: TMatrix<T>,
    sx: number,
    sy: number,
    w: number,
    h: number,
): TMatrix<T> {
    return create<T>(w, h, (x, y): T => {
        return get(matrix, sx + x, sy + y) as T;
    });
}

export function forEach<T>(
    matrix: TMatrix<T>,
    callback: (item: T, x: number, y: number, i: number) => unknown,
): boolean {
    for (let i = 0; i < matrix.buffer.length; i++) {
        const x = i % matrix.w;
        const y = (i / matrix.w) | 0;

        if (callback(matrix.buffer[i], x, y, i) === STOP_ITERATE) {
            return true;
        }
    }

    return false;
}

export function reduce<T, Acc>(
    matrix: TMatrix<T>,
    accumulator: Acc,
    callback: (
        accumulator: Acc,
        item: T,
        x: number,
        y: number,
        i: number,
    ) => Acc,
): Acc {
    forEach(matrix, (item, x, y, i) => {
        accumulator = callback(accumulator, item, x, y, i);
    });

    return accumulator;
}

export function find<T>(
    matrix: TMatrix<T>,
    callback: (item: T, x: number, y: number, i: number) => boolean,
): undefined | Item<T> {
    let item;

    forEach(matrix, (v, x, y, i) => {
        if (callback(v, x, y, i)) {
            item = getItem(matrix, x, y, matrix.buffer[i]);
            return STOP_ITERATE;
        }
    });

    return item;
}

export function some<T>(
    matrix: TMatrix<T>,
    callback: (item: T, x: number, y: number, i: number) => boolean,
): boolean {
    return find(matrix, callback) !== undefined;
}

export function many<T>(
    matrix: TMatrix<T>,
    callback: (item: T, x: number, y: number, i: number) => boolean,
): boolean {
    let result = false;

    forEach(matrix, (v, x, y, i) => {
        const r = callback(v, x, y, i);
        result = result || r;
    });

    return result;
}

export function every<T>(
    matrix: TMatrix<T>,
    callback: (item: T, x: number, y: number, i: number) => boolean,
): boolean {
    return find(matrix, (v, x, y, i) => !callback(v, x, y, i)) === undefined;
}

export function seed<T>(
    matrix: TMatrix<T>,
    filler: (x: number, y: number, i: number) => T,
): void {
    forEach(matrix, (item, x, y, i) => {
        set(matrix, x, y, filler(x, y, i));
    });
}

export function fill<T>(
    matrix: TMatrix<T>,
    filler: (item: T, x: number, y: number) => T,
): void {
    forEach(matrix, (item, x, y) => {
        set(matrix, x, y, filler(item, x, y));
    });
}

export function map<T>(
    source: TMatrix<T>,
    mapper: (item: T, x: number, y: number) => T,
): TMatrix<T> {
    const target = create<T>(source.w, source.h);

    forEach(source, (_, x, y) => {
        set(target, x, y, mapper(get(source, x, y)!, x, y));
    });

    return target;
}

export function get<T>(
    source: TMatrix<T>,
    x: number,
    y: number,
): undefined | T {
    return inside(source, x, y) ? source.buffer[x + y * source.w] : undefined;
}

export function set<T>(
    source: TMatrix<T>,
    x: number,
    y: number,
    item: T,
): undefined | T {
    return inside(source, x, y)
        ? (source.buffer[x + y * source.w] = item)
        : undefined;
}

export function copy<T>(source: TMatrix<T>): TMatrix<T> {
    return setSource(create(source.w, source.h), source.buffer);
}

export function toArray<T>(source: TMatrix<T>): T[] {
    return source.buffer;
}

export function toNestedArray<T>(matrix: TMatrix<T>): T[][] {
    const m = new Array(matrix.h)
        .fill(null)
        .map(() => new Array(matrix.w).fill(null));

    Matrix.forEach(matrix, (v, x, y) => {
        m[y][x] = v;
    });

    return m;
}

export function setSource<T>(source: TMatrix<T>, buffer: T[]): TMatrix<T> {
    source.buffer = buffer;
    return source;
}

function inside(matrix: TMatrix, x: number, y: number) {
    return x >= 0 && x < matrix.w && y >= 0 && y < matrix.h;
}
