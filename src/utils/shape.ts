import { sign, sqrt } from './math';

export type Size = { w: number; h: number };
export const newSize = (w: number, h?: number): Size => ({ w, h: h ?? w });

export type Point = { x: number; y: number };
export const newPoint = (x: number, y: number): Point => ({ x, y });

// VECTOR
export type Vector = { x: number; y: number };

export const newVector = (x: number, y: number): Vector => ({ x, y });

export const setVector = (t: Vector, s: Vector): Vector => {
    t.x = s.x;
    t.y = s.y;
    return t;
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

export const widthVector = (a: Vector): number => sqrt(a.x ** 2 + a.y ** 2);

export const isEqualVectors = (a: Vector, b: Vector): boolean =>
    a.x === b.x && a.y === b.y;

export const hasEqualDirection = (a: Vector, b: Vector): boolean =>
    isEqualVectors(mapVector(a, sign), mapVector(b, sign));

export const toOneWayVectors = (a: Vector): Vector[] => {
    if (isEqualVectors(a, zeroVector)) return [zeroVector];

    const result: Vector[] = [];

    a.x !== 0 && result.push(newVector(a.x, 0));
    a.y !== 0 && result.push(newVector(0, a.y));

    return result;
};

export const stringVector = (v: Vector): string => `Vector{${v.x},${v.y}`;

export const zeroVector = newVector(0, 0);
