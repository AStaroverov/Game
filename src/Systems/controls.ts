import { filter, fromEvent, map } from 'rxjs';

import { Card } from '../Entities/Card';
import { Player } from '../Entities/Player';

export function controlsSystem(entities: { card: Card; player: Player }): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
            filter((e) => {
                return (
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowDown'
                );
            }),
            map((e) => {
                return [
                    e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0,
                    e.key === 'ArrowDown' ? -1 : e.key === 'ArrowUp' ? 1 : 0,
                ];
            }),
        )
        .subscribe(([x, y]) => {
            entities.card.move(-x, -y);
            entities.player.move(x, y);
        });
}
