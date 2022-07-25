import { pick } from 'lodash';

import { createEntity } from '../../../lib/ECS/Entity';
import { ActionableComponentProps, createActionableComponent } from '../../Components/Actionable';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { AtlasName } from '../../Components/AtlasAnimation/atlases';
import { createAutoUnspawnableComponent, UnspawnReason } from '../../Components/AutoRemovable';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createHumanDiseaseComponent } from '../../Components/HumanDisease';
import { createPersonComponent, TPerson } from '../../Components/Person';
import { createPositionComponent } from '../../Components/Position';
import { createBaseMeshComponent } from '../../Components/Renders/BaseMeshComponent';
import { createTagComponent } from '../../Components/Tag';
import { createTypeComponent } from '../../Components/Type';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { TDiseaseID } from '../../Definitions/Diseases/def';
import { Size, TVector } from '../../utils/shape';

export enum NPCType {
    First = 'First',
    Common = 'Common',
}

export const NPCEntityID = 'NPC_ENTITY' as const;
export type NpcEntity = ReturnType<typeof createNpcEntity>;
export const createNpcEntity = (
    props: TPerson & {
        tags?: string[];
        type?: NPCType;
        position?: TVector;
        direction?: TVector;
        unspawnReason?: UnspawnReason[];
        action?: ActionableComponentProps;
        diseaseId?: TDiseaseID;
    },
) => {
    return createEntity(NPCEntityID, [
        createTagComponent(props.tags),
        createTypeComponent(props.type ?? NPCType.Common),
        createAutoUnspawnableComponent(props.unspawnReason),
        createVisualSizeComponent(Size.create(1)),
        createPositionComponent(props.position),
        createDirectionComponent(props.direction),
        createVelocityComponent(),
        createBaseMeshComponent(),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlasName: AtlasName.Skeleton,
        }),

        createActionableComponent(props.action),

        createPersonComponent(pick(props, 'name', 'sex', 'age')),
        createHumanDiseaseComponent(props.diseaseId),
    ]);
};
