import { createEntity } from '../../../lib/ECS/Entity';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { atlases, AtlasName } from '../../Components/AtlasAnimation/atlases';
import {
    createAutoUnspawnableComponent,
    UnspawnReason,
} from '../../Components/AutoRemovable';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createHealComponent } from '../../Components/Heal';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createHealBarMeshComponent } from '../../Components/Renders/HealBarMeshComponent';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';
import { newSize } from '../../utils/shape';

const enemyAtlas = atlases[AtlasName.Skeleton];

export const EnemyEntityID = 'ENEMY_ENTITY' as const;
export type EnemyEntity = ReturnType<typeof createEnemyEntity>;
export const createEnemyEntity = (maxHP = 1) => {
    return createEntity(EnemyEntityID, [
        createAutoUnspawnableComponent([UnspawnReason.OutOfCard]),
        createVisualSizeComponent(newSize(TILE_SIZE)),
        createPositionComponent(),
        createDirectionComponent(),
        createVelocityComponent(),
        createBaseMeshComponent({
            w: enemyAtlas.w * 2.2,
            h: enemyAtlas.h * 2.2,
            transparent: true,
            alphaTest: 0.5,
        }),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlasName: AtlasName.Skeleton,
        }),
        createHealComponent(maxHP),
        createHealBarMeshComponent(),
    ]);
};
