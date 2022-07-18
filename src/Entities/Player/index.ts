import { createEntity, getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { AtlasName } from '../../Components/AtlasAnimation/atlases';
import { BackpackComponentID, createBackpackComponent } from '../../Components/Backpack';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { PLAYER_START_POSITION } from '../../CONST';
import { GameHeap } from '../../heap';
import { Size } from '../../utils/shape';

export const PlayerEntityID = 'PLAYER_ENTITY' as const;
export type PlayerEntity = ReturnType<typeof createPlayerEntity>;
export const createPlayerEntity = () => {
    return createEntity(PlayerEntityID, [
        createVisualSizeComponent(Size.create(1)),
        createPositionComponent(PLAYER_START_POSITION),
        createDirectionComponent(),
        createVelocityComponent(),
        createBaseMeshComponent(),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlasName: AtlasName.Player,
        }),
        createBackpackComponent(),
    ]);
};

export function getPlayerBackpack(gameHeap: GameHeap) {
    const player = getEntities(gameHeap, PlayerEntityID)[0];
    return getComponentStruct(player, BackpackComponentID);
}
