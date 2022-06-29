import { createEntity } from '../../../lib/ECS/Entity';
import { createColliderComponent } from '../../Components/Collider';
import { createPositionComponent } from '../../Components/Position';
import { createMeshComponent } from '../../Components/Renders/MeshComponent';
import { createSizeComponent } from '../../Components/Size';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { StageName } from '../../Renderer';
import { Size, TSize, TVector } from '../../utils/shape';

export const HouseEntityID = 'HOUSE_ENTITY' as const;
export type HouseEntity = ReturnType<typeof createHouseEntity>;
export const createHouseEntity = (position: TVector, size: TSize) => {
    return createEntity(HouseEntityID, [
        createMeshComponent({ layer: StageName.Main }),
        createPositionComponent(position),
        createSizeComponent(size),
        createVisualSizeComponent(Size.ZERO),
        createColliderComponent(size),
        // createAutoUnspawnableComponent([UnspawnReason.OutOfCard]),
    ]);
};
