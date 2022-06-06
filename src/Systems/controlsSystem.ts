import { filter, fromEvent } from 'rxjs';

import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import {
    setVelocityByVector,
    VelocityComponentID,
} from '../Components/Velocity';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { mulVector, Vector } from '../utils/shape';
import {
    TasksScheduler,
    tasksScheduler,
} from '../utils/TasksScheduler/TasksScheduler';

export function controlsSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerVelocity = getComponentStruct(
        playerEntity,
        VelocityComponentID,
    );
    const playerDirection = getComponentStruct(
        playerEntity,
        DirectionComponentID,
    );

    fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(filter(isArrow))
        .subscribe((e) => {
            onArrowDown(e, playerDirection);
        });

    fromEvent<KeyboardEvent>(document, 'keyup')
        .pipe(filter(isArrow))
        .subscribe((e) => {
            onArrowUp(e, playerDirection);
        });

    tasksScheduler.addFrameInterval(() => {
        setVelocityByVector(playerVelocity, mulVector(playerDirection, 0.08));
    }, 1);
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
