import { filter, fromEvent, share } from 'rxjs';

const keypress$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(share());

export const fromKeyUp = (...codes: KeyboardEvent['code'][]) =>
    keypress$.pipe(filter((e) => codes.includes(e.code)));
