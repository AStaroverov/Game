import { randomArbitraryInt } from './random';

export function getRandomGreyColor(): number {
    const grey = randomArbitraryInt(150, 255).toString(16);
    return parseInt(`0x${grey}${grey}${grey}`);
}
