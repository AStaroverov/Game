import { createEntity } from '../../../lib/ECS/Entity';
import { createAutoUnspawnableComponent, UnspawnReason } from '../../Components/AutoRemovable';
import { createColliderComponent } from '../../Components/Collider';
import { createPositionComponent } from '../../Components/Position';
import { createMeshComponent } from '../../Components/Renders/MeshComponent';
import { createSizeComponent } from '../../Components/Size';
import { createTagComponent } from '../../Components/Tag';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { StageName } from '../../Renderer';
import { Size, TSize, TVector } from '../../utils/shape';

export const HouseEntityID = 'HOUSE_ENTITY' as const;
export type HouseEntity = ReturnType<typeof createHouseEntity>;
export const createHouseEntity = (props: {
    tags?: string[];
    size: TSize;
    position: TVector;
    unspawnReason?: UnspawnReason[];
}) => {
    return createEntity(HouseEntityID, [
        createTagComponent(props.tags),
        createMeshComponent({ layer: StageName.Main }),
        createPositionComponent(props.position),
        createSizeComponent(props.size),
        createVisualSizeComponent(Size.ZERO),
        createColliderComponent(props.size),
        createAutoUnspawnableComponent(props.unspawnReason),
    ]);
};
