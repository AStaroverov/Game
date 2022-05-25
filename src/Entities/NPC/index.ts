import { createEntity } from '../../../lib/ECS/Entity';
import { createActionableComponent } from '../../Components/Actionable';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { atlases, AtlasName } from '../../Components/AtlasAnimation/atlases';
import {
    createAutoUnspawnableComponent,
    UnspawnReason,
} from '../../Components/AutoRemovable';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createPositionComponent } from '../../Components/Position';
import { createMeshComponent } from '../../Components/Renders/MeshComponent';
import { createTypeComponent } from '../../Components/Type';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';
import { QuestAction } from '../../Systems/ActionSystem';
import { newSize } from '../../utils/shape';

const enemyAtlas = atlases[AtlasName.Skeleton];

export enum NPCType {
    First = 'First',
}

export const NPCEntityID = 'NPC_ENTITY' as const;
export type NpcEntity = ReturnType<typeof createNpcEntity>;
export const createNpcEntity = (props: {
    type: NPCType;
    actionType?: QuestAction;
}) => {
    return createEntity(NPCEntityID, [
        createTypeComponent(props.type),
        createAutoUnspawnableComponent([UnspawnReason.OutOfCard]),
        createVisualSizeComponent(newSize(TILE_SIZE)),
        createPositionComponent(),
        createDirectionComponent(),
        createVelocityComponent(),
        createMeshComponent({
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
        createActionableComponent({ type: props.actionType }),
    ]);
};
