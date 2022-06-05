import { trunc } from './math';

export const random = Math.random;

export function randomArbitrary(min: number, max: number): number {
    return random() * (max - min) + min;
}

export function randomSign(): number {
    return random() > 0.5 ? 1 : -1;
}

export function getRandomId(): string {
    return String(trunc(Date.now() * Math.random()));
}
