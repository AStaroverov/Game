export type Size = { w: number; h: number };
export const newSize = (w: number, h?: number): Size => ({ w, h: h ?? w });

export type Point = { x: number; y: number };
export const newPoint = (x: number, y: number): Point => ({ x, y });

export type Vector = { x: number; y: number };
export const newVector = (x: number, y: number): Vector => ({ x, y });
export const mulVector = (v: Vector, k: number): Vector => {
    return newVector(v.x * k, v.y * k);
};
