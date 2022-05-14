import { filter, fromEvent, map, tap } from 'rxjs';

import { getComponent } from '../../lib/ECS/entities';
import { Heap } from '../../lib/ECS/heap';
import {
    DirectionComponent,
    setDirection,
} from '../Components/DirectionComponent';
import { setVelocity, VelocityConstructor } from '../Components/Velocity';
import { isPlayerEntity } from '../Entities/Player';
import { Vector } from '../utils/shape';

export function controlsSystem(heap: Heap): void {
    const playerEntity = [...heap.getEntities(isPlayerEntity)][0];
    const playerDirection = getComponent(playerEntity, DirectionComponent);
    const playerVelocity = getComponent(playerEntity, VelocityConstructor);

    const pressed = new Set();

    fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
            filter(isArrow),
            filter((e) => !pressed.has(e.key)),
            tap((e) => pressed.add(e.key)),
            map(arrowDownToVector),
        )
        .subscribe((vector) => {
            setDirection(
                playerDirection,
                vector.x ?? playerDirection.x,
                vector.y ?? playerDirection.y,
            );

            setVelocity(playerVelocity, 0.08);
        });

    fromEvent<KeyboardEvent>(document, 'keyup')
        .pipe(filter(isArrow))
        .subscribe((e) => {
            pressed.delete(e.key);

            if (pressed.size === 0) {
                setVelocity(playerVelocity, 0);
            }
        });
}

function isArrow({ key }: KeyboardEvent): boolean {
    return (
        key === 'ArrowLeft' ||
        key === 'ArrowRight' ||
        key === 'ArrowUp' ||
        key === 'ArrowDown'
    );
}

function arrowDownToVector({ key }: KeyboardEvent): Vector {
    return {
        x: key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : 0,
        y: key === 'ArrowDown' ? -1 : key === 'ArrowUp' ? 1 : 0,
    };
}
