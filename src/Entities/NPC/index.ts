import { createEntity } from '../../../lib/ECS/Entity';
import { ActionableComponentProps, createActionableComponent } from '../../Components/Actionable';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { atlases, AtlasName } from '../../Components/AtlasAnimation/atlases';
import { createAutoUnspawnableComponent, UnspawnReason } from '../../Components/AutoRemovable';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createTypeComponent } from '../../Components/Type';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';
import { newSize } from '../../utils/shape';

const enemyAtlas = atlases[AtlasName.Skeleton];

export enum NPCType {
    First = 'First',
}

export const NPCEntityID = 'NPC_ENTITY' as const;
export type NpcEntity = ReturnType<typeof createNpcEntity>;
export const createNpcEntity = (props: { type: NPCType; action: ActionableComponentProps }) => {
    return createEntity(NPCEntityID, [
        createTypeComponent(props.type),
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
        createActionableComponent(props.action),
    ]);
};
