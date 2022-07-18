import { filter, fromEvent, scan } from 'rxjs';

import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { DirectionComponentID } from '../Components/DirectionComponent';
import { setVelocityByVector, VelocityComponentID } from '../Components/Velocity';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { fromKeyUp } from '../utils/RX/keypress';
import { mulVector, TVector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';
import { BackpackRenderSystem } from './Renders/UI/BackpackRenderSystem';

export function ControlsSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerVelocity = getComponentStruct(playerEntity, VelocityComponentID);
    const playerDirection = getComponentStruct(playerEntity, DirectionComponentID);

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

    fromKeyUp('KeyO')
        .pipe(
            scan(
                (off) => (off ? off() : BackpackRenderSystem(heap)),
                undefined as void | VoidFunction,
            ),
        )
        .subscribe();

    ticker.addFrameInterval(() => {
        setVelocityByVector(playerVelocity, mulVector(playerDirection, 0.005));
    }, 1);
}

function isArrow({ key }: KeyboardEvent): boolean {
    return key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown';
}

function onArrowDown({ key }: KeyboardEvent, v: TVector) {
    v.x = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : v.x;
    v.y = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : v.y;
}

function onArrowUp({ key }: KeyboardEvent, v: TVector) {
    v.x = key === 'ArrowLeft' && v.x === -1 ? 0 : key === 'ArrowRight' && v.x === 1 ? 0 : v.x;
    v.y = key === 'ArrowUp' && v.y === -1 ? 0 : key === 'ArrowDown' && v.y === 1 ? 0 : v.y;
}
