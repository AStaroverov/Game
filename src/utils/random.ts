export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function getRandomSign(): number {
    return Math.random() > 0.5 ? 1 : -1;
}
