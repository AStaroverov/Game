import { filter, fromEvent, map, tap } from 'rxjs';

import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import { setVelocity, VelocityComponentID } from '../Components/Velocity';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { newVector, setVector, Vector } from '../utils/shape';

export function controlsSystem(heap: GameHeap): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerVelocity = getComponentStruct(
        playerEntity,
        VelocityComponentID,
    );
    const playerDirection = getComponentStruct(
        playerEntity,
        DirectionComponentID,
    );

    const pressed = new Set();

    fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
            filter(isArrow),
            filter((e) => !pressed.has(e.key)),
            tap((e) => pressed.add(e.key)),
            map(arrowDownToVector),
        )
        .subscribe((vector) => {
            setVector(
                playerDirection,
                newVector(
                    vector.x ?? playerDirection.x,
                    vector.y ?? playerDirection.y,
                ),
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
