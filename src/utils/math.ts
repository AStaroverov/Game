export const abs = Math.abs;
export const sign = Math.sign;
export const floor = Math.floor;
export const ceil = Math.ceil;
export const round = Math.round;
export const sin = Math.sin;
export const cos = Math.cos;
export const trunc = Math.trunc;

export function ufloor(n: number): number {
    return sign(n) * floor(abs(n));
}

export function uceil(n: number): number {
    return sign(n) * ceil(abs(n));
}

export function uround(n: number): number {
    return sign(n) * round(abs(n));
}
