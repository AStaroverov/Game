import { pick } from 'lodash';

import { createEntity } from '../../../lib/ECS/Entity';
import { ActionableComponentProps, createActionableComponent } from '../../Components/Actionable';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { AtlasName } from '../../Components/AtlasAnimation/atlases';
import { createAutoUnspawnableComponent, UnspawnReason } from '../../Components/AutoRemovable';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createPersonComponent, TPerson } from '../../Components/Person';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createTypeComponent } from '../../Components/Type';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { Size, TVector } from '../../utils/shape';

export enum NPCType {
    First = 'First',
    Common = 'Common',
}

export const NPCEntityID = 'NPC_ENTITY' as const;
export type NpcEntity = ReturnType<typeof createNpcEntity>;
export const createNpcEntity = (
    props: TPerson & {
        type?: NPCType;
        action?: ActionableComponentProps;
        position?: TVector;
        unspawnReason?: UnspawnReason[];
    },
) => {
    return createEntity(NPCEntityID, [
        createTypeComponent(props.type ?? NPCType.Common),
        createPersonComponent(pick(props, 'name', 'sex', 'age')),
        createAutoUnspawnableComponent(props.unspawnReason),
        createVisualSizeComponent(Size.create(1)),
        createPositionComponent(props.position),
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
