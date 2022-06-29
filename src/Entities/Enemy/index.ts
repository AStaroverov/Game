import { createEntity } from '../../../lib/ECS/Entity';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { AtlasName } from '../../Components/AtlasAnimation/atlases';
import { createAutoUnspawnableComponent, UnspawnReason } from '../../Components/AutoRemovable';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { Size } from '../../utils/shape';

export const EnemyEntityID = 'ENEMY_ENTITY' as const;
export type EnemyEntity = ReturnType<typeof createEnemyEntity>;
export const createEnemyEntity = () => {
    return createEntity(EnemyEntityID, [
        createAutoUnspawnableComponent([UnspawnReason.OutOfCard]),
        createVisualSizeComponent(Size.create(1)),
        createPositionComponent(),
        createDirectionComponent(),
        createVelocityComponent(),
        createBaseMeshComponent(),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlasName: AtlasName.Skeleton,
        }),
    ]);
};
