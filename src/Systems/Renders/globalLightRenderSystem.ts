import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { GameTimeComponentID } from '../../Components/GameTime';
import { SpotLightMeshComponentID } from '../../Components/Renders/LightComponent';
import { $object } from '../../CONST';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { WorldEntityID } from '../../Entities/World';
import { GameHeap } from '../../heap';
import { cos } from '../../utils/math';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const ONE_DAY = 5 * 60 * 1000; // 5 min

export function globalLightRenderSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
): void {
    const globalLight = getEntities(heap, GlobalLightEntityID)[0];
    const spotLight = getComponentStruct(globalLight, SpotLightMeshComponentID);

    const world = getEntities(heap, WorldEntityID)[0];
    const gameTime = getComponentStruct(world, GameTimeComponentID);

    update();
    ticker.addTimeInterval(update, 1_000);

    function update() {
        if (spotLight[$object]) {
            spotLight[$object]!.angle =
                0.6 + (1 + cos(gameTime.time / ONE_DAY)) / 2;
            spotLight[$object]!.intensity =
                1 + (1 + cos(gameTime.time / ONE_DAY)) / 2;
        }
    }
}
