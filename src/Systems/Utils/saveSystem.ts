import { filter, fromEvent, share } from 'rxjs';

import { getSnapshot } from '../../../lib/ECS/Heap';
import { GAME_VERSION } from '../../CONST';
import { GameHeap } from '../../heap';

export function saveSystem(heap: GameHeap) {
    const press$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
        filter((e) => e.metaKey),
        share(),
    );

    press$.pipe(filter((e) => e.code === 'KeyS')).subscribe((e) => {
        e.preventDefault();
        localStorage.setItem(
            `SAVE_${GAME_VERSION}`,
            JSON.stringify(getSnapshot(heap)),
        );
    });

    press$.pipe(filter((e) => e.code === 'KeyL')).subscribe(() => {
        const save = localStorage.getItem(`SAVE_${GAME_VERSION}`);
        console.log('>>', save);
    });
}
