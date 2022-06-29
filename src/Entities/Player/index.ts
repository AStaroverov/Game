import { createEntity } from '../../../lib/ECS/Entity';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { AtlasName } from '../../Components/AtlasAnimation/atlases';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { PLAYER_START_POSITION, TILE_SIZE } from '../../CONST';
import { newSize } from '../../utils/shape';

export const PlayerEntityID = 'PLAYER_ENTITY' as const;
export type PlayerEntity = ReturnType<typeof createPlayerEntity>;
export const createPlayerEntity = () => {
    return createEntity(PlayerEntityID, [
        createVisualSizeComponent(newSize(TILE_SIZE)),
        createPositionComponent(PLAYER_START_POSITION),
        createDirectionComponent(),
        createVelocityComponent(),
        createBaseMeshComponent(),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlasName: AtlasName.Player,
        }),
        // createHealComponent(100),
        // createHealBarMeshComponent(),
    ]);
};
