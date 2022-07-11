import { filter, fromEvent, share } from 'rxjs';

const keypress$ = fromEvent<KeyboardEvent>(document, 'keypress').pipe(share());

export const fromKeyPress = (...codes: KeyboardEvent['code'][]) =>
    keypress$.pipe(filter((e) => codes.includes(e.code)));
