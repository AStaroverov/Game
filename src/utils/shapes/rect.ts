import { TSize, TVector, Vector } from '../shape';

export type TRect = TVector &
    TSize & {
        mx: number;
        my: number;
    };
export const create = (x: number, y: number, w: number, h: number): TRect => {
    return { x, y, w, h, mx: x + w, my: y + h };
};

export const inside = (a: TRect, b: TRect): boolean => {
    return a.x >= b.x && a.y >= b.y && a.mx <= b.mx && a.my <= b.my;
};

export const pointInside = (r: TRect, p: TVector): boolean => {
    return r.x <= p.x && r.y <= p.y && r.mx >= p.x && r.my >= p.y;
};

export const notIntersect = (a: TRect, b: TRect): boolean => {
    return a.mx < b.x || a.x > b.mx || a.my < b.y || a.y > b.my;
};

export const intersect = (a: TRect, b: TRect): boolean => {
    return !notIntersect(a, b);
};

export const getAllVertexes = (r: TRect): TVector[] => {
    return [
        Vector.create(r.x, r.y),
        Vector.create(r.x, r.my),
        Vector.create(r.mx, r.my),
        Vector.create(r.mx, r.y),
    ];
};

export const Rect = {
    create,
    inside,
    pointInside,
    intersect,
    notIntersect,
    getAllVertexes,
};
