import { filter, fromEvent } from 'rxjs';

export const fromKeyPress = (...codes: KeyboardEvent['code'][]) =>
    fromEvent<KeyboardEvent>(document, 'keypress').pipe(
        filter((e) => codes.includes(e.code)),
    );
