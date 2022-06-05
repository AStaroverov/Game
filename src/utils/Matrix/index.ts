import { Size } from '../shape';

export type TMatrix<T = unknown> = Size & { buffer: T[] };
export type TMatrixSeed<T> = (x: number, y: number) => T;

export type ExtractMatrixItem<M extends TMatrix> = M extends TMatrix<infer T>
    ? T
    : never;

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

export function forEach<T>(
    matrix: TMatrix<T>,
    callback: (item: T, x: number, y: number, i: number) => void,
): void {
    matrix.buffer.forEach((v, i) => {
        const x = i % matrix.w;
        const y = (i / matrix.w) | 0;

        callback(v, x, y, i);
    });
}

export function seed<T>(
    matrix: TMatrix<T>,
    filler: (x: number, y: number) => T,
): void {
    forEach(matrix, (item, x, y) => {
        set(matrix, x, y, filler(x, y));
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

export function toArray<T>(source: TMatrix<T>): T[] {
    return source.buffer;
}

export function setSource<T>(source: TMatrix<T>, buffer: T[]): void {
    source.buffer = buffer;
}

function inside(matrix: TMatrix, x: number, y: number) {
    return x >= 0 && x < matrix.w && y >= 0 && y < matrix.h;
}

export const Matrix = {
    create,
    seed,
    forEach,
    fill,
    map,
    get,
    set,
    toArray,
    setSource,
};
