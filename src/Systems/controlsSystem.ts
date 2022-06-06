import { filter, fromEvent, tap } from 'rxjs';

import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import {
    setVelocity,
    setVelocityByVector,
    VelocityComponentID,
} from '../Components/Velocity';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { mulVector, Vector } from '../utils/shape';

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
        )
        .subscribe((e) => {
            onArrowDown(e, playerDirection);
            setVelocityByVector(
                playerVelocity,
                mulVector(playerDirection, 0.08),
            );
        });

    fromEvent<KeyboardEvent>(document, 'keyup')
        .pipe(
            filter(isArrow),
            tap((e) => pressed.delete(e.key)),
        )
        .subscribe((e) => {
            onArrowUp(e, playerDirection);
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

function onArrowDown({ key }: KeyboardEvent, v: Vector) {
    v.x = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : v.x;
    v.y = key === 'ArrowDown' ? -1 : key === 'ArrowUp' ? 1 : v.y;
}

function onArrowUp({ key }: KeyboardEvent, v: Vector) {
    v.x =
        key === 'ArrowLeft' && v.x === -1
            ? 0
            : key === 'ArrowRight' && v.x === 1
            ? 0
            : v.x;
    v.y =
        key === 'ArrowDown' && v.y === -1
            ? 0
            : key === 'ArrowUp' && v.y === 1
            ? 0
            : v.y;
}
