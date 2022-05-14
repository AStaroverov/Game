import { getComponent } from '../../../lib/ECS/entities';
import { Heap } from '../../../lib/ECS/heap';
import { GameTimeConstructor } from '../../Components/GameTime';
import { SpotLightMeshComponent } from '../../Components/Renders/LightComponent';
import { isGlobalLightEntity } from '../../Entities/GlobalLight';
import { isWorldEntity } from '../../Entities/World';
import { cos } from '../../utils/math';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const ONE_DAY = 5 * 60 * 1000; // 5 min

export function globalLightRenderSystem(
    heap: Heap,
    ticker: TasksScheduler,
): void {
    const globalLight = [...heap.getEntities(isGlobalLightEntity)][0];
    const spotLight = getComponent(globalLight, SpotLightMeshComponent);

    const world = [...heap.getEntities(isWorldEntity)][0];
    const gameTime = getComponent(world, GameTimeConstructor);

    update();
    ticker.addTimeInterval(update, 1_000);

    function update() {
        spotLight.object.angle = 0.6 + (1 + cos(gameTime.time / ONE_DAY)) / 2;
        spotLight.object.intensity = 1 + (1 + cos(gameTime.time / ONE_DAY)) / 2;
    }
}
