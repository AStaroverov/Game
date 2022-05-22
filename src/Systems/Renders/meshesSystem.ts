import { InheritedComponent } from '../../../lib/ECS/Component';
import {
    getComponentStruct,
    getInheritedComponentStructs,
    hasInheritedComponent,
    SomeEntity,
    tryGetComponentStruct,
} from '../../../lib/ECS/Entity';
import { filterEntities, getEntities } from '../../../lib/ECS/Heap';
import { ReliefMeshesMatrixID } from '../../Components/Matrix/ReliefMeshesMatrixComponent';
import { SurfaceMeshesMatrixID } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import {
    PositionComponent,
    PositionComponentID,
} from '../../Components/Position';
import { SpotLightMeshComponentID } from '../../Components/Renders/LightComponent';
import {
    MeshComponent,
    MeshComponentID,
} from '../../Components/Renders/MeshComponent';
import {
    $object,
    CENTER_CARD_POSITION,
    HALF_RENDER_CARD_SIZE,
} from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { GameHeap } from '../../heap';
import { Layer, Scenes } from '../../Renderer';
import { abs } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
import { mulVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function meshesSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
    scenes: Scenes,
): void {
    const globalLightEntity = getEntities(heap, GlobalLightEntityID)[0];
    const spotLight = getComponentStruct(
        globalLightEntity,
        SpotLightMeshComponentID,
    );

    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    const surfaceMeshes = getComponentStruct(cardEntity, SurfaceMeshesMatrixID);
    const reliefMeshes = getComponentStruct(cardEntity, ReliefMeshesMatrixID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const staticMeshes = [
            spotLight[$object],
            spotLight[$object]?.target,
            ...Matrix.toArray(surfaceMeshes.matrix).map((v) => v[$object]),
            ...Matrix.toArray(reliefMeshes.matrix).map((v) => v[$object]),
        ].filter(
            <T>(object: undefined | T): object is T => object !== undefined,
        );

        scenes[Layer.Main].clear();
        scenes[Layer.Fixed].clear();

        if (staticMeshes.length > 0) {
            scenes[Layer.Main].add(...staticMeshes);
        }

        filterEntities(
            heap,
            (e): e is SomeEntity<InheritedComponent<MeshComponent>> => {
                return hasInheritedComponent(e, MeshComponentID);
            },
        ).forEach((entity) => {
            const mesh = getInheritedComponentStructs(entity, MeshComponentID);
            const position = tryGetComponentStruct<PositionComponent>(
                entity,
                PositionComponentID,
            );

            const diff =
                position &&
                sumVector(
                    position,
                    mulVector(CENTER_CARD_POSITION, -1),
                    cardPosition,
                );
            const isVisible =
                diff &&
                !(
                    abs(diff.x) > HALF_RENDER_CARD_SIZE + 5 ||
                    abs(diff.y) > HALF_RENDER_CARD_SIZE + 5
                );

            mesh.forEach((struct) => {
                const object = struct[$object];

                if (object) {
                    scenes[struct.layer].add(object);

                    if (isVisible !== undefined) {
                        object.visible = isVisible;
                    }
                }
            });
        });
    }
}
