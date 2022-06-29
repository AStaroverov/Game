import { createEntity } from '../../../lib/ECS/Entity';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { atlases, AtlasName } from '../../Components/AtlasAnimation/atlases';
import { createAutoUnspawnableComponent, UnspawnReason } from '../../Components/AutoRemovable';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';
import { newSize } from '../../utils/shape';

const enemyAtlas = atlases[AtlasName.Skeleton];

export const EnemyEntityID = 'ENEMY_ENTITY' as const;
export type EnemyEntity = ReturnType<typeof createEnemyEntity>;
export const createEnemyEntity = () => {
    return createEntity(EnemyEntityID, [
        createAutoUnspawnableComponent([UnspawnReason.OutOfCard]),
        createVisualSizeComponent(newSize(TILE_SIZE)),
        createPositionComponent(),
        createDirectionComponent(),
        createVelocityComponent(),
        createBaseMeshComponent(),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlasName: AtlasName.Skeleton,
        }),
        // createHealComponent(1),
        // createHealBarMeshComponent(),
    ]);
};
