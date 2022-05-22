import { createEntity } from '../../../lib/ECS/Entity';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { atlases, AtlasName } from '../../Components/AtlasAnimation/atlases';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createHealComponent } from '../../Components/Heal';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createHealBarMeshComponent } from '../../Components/Renders/HealBarMeshComponent';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { PLAYER_START_POSITION, TILE_SIZE } from '../../CONST';
import { newSize } from '../../utils/shape';

const playerAtlas = atlases[AtlasName.Player];

export const PlayerEntityID = 'PLAYER_ENTITY' as const;
export type PlayerEntity = ReturnType<typeof createPlayerEntity>;
export const createPlayerEntity = () => {
    return createEntity(PlayerEntityID, [
        createVisualSizeComponent(newSize(TILE_SIZE)),
        createPositionComponent(PLAYER_START_POSITION),
        createDirectionComponent(),
        createVelocityComponent(),
        createBaseMeshComponent({
            w: playerAtlas.w * 3,
            h: playerAtlas.h * 3,
            alphaTest: 0.5,
            transparent: true,
        }),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlasName: AtlasName.Player,
        }),
        createHealComponent(100),
        createHealBarMeshComponent(),
    ]);
};
