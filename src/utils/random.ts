export const random = Math.random;

export function getRandomArbitrary(min: number, max: number): number {
    return random() * (max - min) + min;
}

export function getRandomSign(): number {
    return random() > 0.5 ? 1 : -1;
}
