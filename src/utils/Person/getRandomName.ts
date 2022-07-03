import { randomArbitraryInt } from '../random';
import First from './first.json';
import Last from './last.json';

function capFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRandomName(): string {
    return (
        capFirst(First[randomArbitraryInt(0, First.length - 1)]) +
        ' ' +
        capFirst(Last[randomArbitraryInt(0, Last.length - 1)])
    );
}
