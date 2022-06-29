import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { GameTimeComponentID } from '../../Components/GameTime';
import { AmbientLightMeshComponentID } from '../../Components/Renders/LightComponent';
import { $ref } from '../../CONST';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { WorldEntityID } from '../../Entities/World';
import { GameHeap } from '../../heap';
import { sin } from '../../utils/math';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const ONE_DAY = 5 * 60 * 1000; // 5 min

export function GlobalLightRenderSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const globalLight = getEntities(heap, GlobalLightEntityID)[0];
    const ambient = getComponentStruct(globalLight, AmbientLightMeshComponentID);

    const world = getEntities(heap, WorldEntityID)[0];
    const gameTime = getComponentStruct(world, GameTimeComponentID);

    update();
    ticker.addTimeInterval(update, 16);

    function update() {
        const displayObject = ambient[$ref];

        if (displayObject) {
            displayObject.alpha = (1 + sin(gameTime.time / ONE_DAY)) / 2;
        }
    }
}
