export type Size = { w: number; h: number };
export const newSize = (w: number, h?: number): Size => ({ w, h: h ?? w });

export type Point = { x: number; y: number };
export const newPoint = (x: number, y: number): Point => ({ x, y });

export type Vector = { x: number; y: number };
export const newVector = (x: number, y: number): Vector => ({ x, y });
export const copyVector = (v: Vector): Vector => {
    return newVector(v.x, v.y);
};
export const mapVector = (t: Vector, map: (v: number) => number): Vector => {
    return newVector(map(t.x), map(t.y));
};
export const setVector = (t: Vector, s: Vector): void => {
    t.x = s.x;
    t.y = s.y;
};
export const sumVector = (f: Vector, ...vs: Vector[]): Vector => {
    return vs.reduce((sum, v) => {
        sum.x += v.x;
        sum.y += v.y;
        return sum;
    }, copyVector(f));
};
export const mulVector = (v: Vector, k: number): Vector => {
    return newVector(v.x * k, v.y * k);
};
export const floorVector = (v: Vector): Vector => {
    return newVector(Math.floor(v.x), Math.floor(v.y));
};
export const ceilVector = (v: Vector): Vector => {
    return newVector(Math.ceil(v.x), Math.ceil(v.y));
};
export const roundVector = (v: Vector): Vector => {
    return newVector(Math.round(v.x), Math.round(v.y));
};
export const signVector = (v: Vector): Vector => {
    return newVector(Math.sign(v.x), Math.sign(v.y));
};
export const isEqualVectors = (a: Vector, b: Vector): boolean => {
    return a.x === b.x && a.y === b.y;
};
export const emptyVector = newVector(0, 0);
