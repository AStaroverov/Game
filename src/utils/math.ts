export const abs = Math.abs;
export const sign = Math.sign;
export const floor = Math.floor;
export const ceil = Math.ceil;
export const round = Math.round;

export function ufloor(n: number): number {
    return sign(n) * floor(abs(n));
}

export function uceil(n: number): number {
    return sign(n) * ceil(abs(n));
}

export function uround(n: number): number {
    return sign(n) * round(abs(n));
}