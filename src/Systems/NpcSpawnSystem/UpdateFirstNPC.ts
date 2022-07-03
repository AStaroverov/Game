import { EDialogueName } from '../../../assets/dialogue/dialogue';
import { ExtractStruct } from '../../../lib/ECS/Component';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../../lib/ECS/Heap';
import { UnspawnReason } from '../../Components/AutoRemovable';
import { TilesMatrix, TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { getRandomPerson } from '../../Components/Person';
import {
    PlayerStoryComponent,
    PlayerStoryComponentID,
    PlayerStoryStep,
} from '../../Components/PlayerStoryProgress';
import { PositionComponentID } from '../../Components/Position';
import { TypeComponentID } from '../../Components/Type';
import { CardEntityID } from '../../Entities/Card';
import { createNpcEntity, NpcEntity, NPCEntityID, NPCType } from '../../Entities/NPC';
import { PlayerEntityID } from '../../Entities/Player';
import { WorldEntityID } from '../../Entities/World';
import { GameHeap } from '../../heap';
import { sumVector, TVector, Vector } from '../../utils/shape';
import { CommonAction } from '../ActionSystem';

export function UpdateFirstNPC(heap: GameHeap): () => boolean {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(playerEntity, PositionComponentID);

    const world = getEntities(heap, WorldEntityID)[0];
    const playerStory = getComponentStruct(world, PlayerStoryComponentID);

    const NPCes = getEntities(heap, NPCEntityID);

    return function update() {
        const npc =
            shouldSpawnFirstNpc(playerStory, NPCes) &&
            spawnFirstNPC(cardTiles, cardPosition, playerPosition);

        npc && addEntity(heap, npc);

        return typeof npc === 'object';
    };
}

export function shouldSpawnFirstNpc(
    playerStory: ExtractStruct<PlayerStoryComponent>,
    NPCes: NpcEntity[],
): boolean {
    if (playerStory.currentStep !== PlayerStoryStep.NewGame) return false;

    const firstNPC = NPCes.find((NPC) => {
        const { type } = getComponentStruct(NPC, TypeComponentID);
        return type === NPCType.First;
    });

    return firstNPC === undefined;
}

function spawnFirstNPC(
    cardTiles: TilesMatrix,
    cardPosition: TVector,
    playerPosition: TVector,
): undefined | NpcEntity {
    return createNpcEntity({
        ...getRandomPerson(),
        type: NPCType.First,
        action: {
            type: CommonAction.Dialog,
            dialogID: EDialogueName.First_meet,
        },
        position: sumVector(playerPosition, Vector.create(1, 0)),
        direction: Vector.create(-1, 0),
        unspawnReason: [UnspawnReason.OutOfCard],
    });
}
