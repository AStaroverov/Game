export type Size = { w: number; h: number };
export const newSize = (w: number, h?: number): Size => ({ w, h: h ?? w });

export type Point = { x: number; y: number };
export const newPoint = (x: number, y: number): Point => ({ x, y });

// VECTOR
export type Vector = { x: number; y: number };

export const newVector = (x: number, y: number): Vector => ({ x, y });

export const setVector = (t: Vector, s: Vector): void => {
    t.x = s.x;
    t.y = s.y;
};
export const copyVector = (v: Vector): Vector => newVector(v.x, v.y);

export const mapVector = (t: Vector, map: (v: number) => number): Vector =>
    newVector(map(t.x), map(t.y));

export const sumVector = (f: Vector, ...vs: Vector[]): Vector => {
    return vs.reduce((sum, v) => {
        sum.x += v.x;
        sum.y += v.y;
        return sum;
    }, copyVector(f));
};
export const mulVector = (v: Vector, k: number): Vector =>
    newVector(v.x * k, v.y * k);

export const negateVector = (v: Vector): Vector => mulVector(v, -1);

export const isEqualVectors = (a: Vector, b: Vector): boolean =>
    a.x === b.x && a.y === b.y;

export const emptyVector = newVector(0, 0);
