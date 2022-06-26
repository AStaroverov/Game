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
import { PositionComponent, PositionComponentID } from '../../Components/Position';
import { SpotLightMeshComponentID } from '../../Components/Renders/LightComponent';
import { MeshComponent, MeshComponentID } from '../../Components/Renders/MeshComponent';
import { VisualSizeComponent, VisualSizeComponentID } from '../../Components/VisualSize';
import { $ref } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GlobalLightEntityID } from '../../Entities/GlobalLight';
import { GameHeap } from '../../heap';
import { Layer, Scenes } from '../../Renderer';
import { isInsideWorldRenderRect } from '../../utils/isInsideWorldRenderRect';
import { Matrix } from '../../utils/Matrix';
import { Size } from '../../utils/shape';
import { Rect } from '../../utils/shapes/rect';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

export function MeshesResetSystem(heap: GameHeap, ticker: TasksScheduler, scenes: Scenes): void {
    const globalLightEntity = getEntities(heap, GlobalLightEntityID)[0];
    const spotLight = getComponentStruct(globalLightEntity, SpotLightMeshComponentID);

    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    const surfaceMeshes = getComponentStruct(cardEntity, SurfaceMeshesMatrixID);
    const reliefMeshes = getComponentStruct(cardEntity, ReliefMeshesMatrixID);

    ticker.addFrameInterval(tick, 1);

    function tick() {
        const staticMeshes = [
            spotLight[$ref],
            spotLight[$ref]?.target,
            ...Matrix.toArray(surfaceMeshes.matrix).map((v) => v[$ref]),
            ...Matrix.toArray(reliefMeshes.matrix).map((v) => v[$ref]),
        ].filter(<T>(object: undefined | T): object is T => object !== undefined);

        scenes[Layer.Main].clear();
        scenes[Layer.Fixed].clear();

        if (staticMeshes.length > 0) {
            scenes[Layer.Main].add(...staticMeshes);
        }

        filterEntities(heap, (e): e is SomeEntity<InheritedComponent<MeshComponent>> => {
            return hasInheritedComponent(e, MeshComponentID);
        }).forEach((entity) => {
            const mesh = getInheritedComponentStructs(entity, MeshComponentID);
            const position = tryGetComponentStruct<PositionComponent>(entity, PositionComponentID);
            let isVisible = true;

            if (position) {
                const visualSize =
                    tryGetComponentStruct<VisualSizeComponent>(entity, VisualSizeComponentID) ??
                    Size.ZERO;
                const visualRect = Rect.create(
                    position.x - visualSize.w / 2,
                    position.y - visualSize.h / 2,
                    visualSize.w,
                    visualSize.h,
                );

                isVisible = isInsideWorldRenderRect(visualRect, cardPosition);
            }

            mesh.forEach((struct) => {
                const object = struct[$ref];

                if (object) {
                    scenes[struct.layer].add(object);
                    object.visible = isVisible;
                }
            });
        });
    }
}
