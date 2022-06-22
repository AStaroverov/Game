import { round, trunc } from './math';

export const random = Math.random;

export function randomArbitraryFloat(min: number, max: number): number {
    return random() * (max - min) + min;
}

export function randomArbitraryInt(min: number, max: number): number {
    return round(randomArbitraryFloat(min, max));
}

export function randomSign(): number {
    return random() > 0.5 ? 1 : -1;
}

export function getRandomId(): string {
    return String(trunc(Date.now() * Math.random()));
}
