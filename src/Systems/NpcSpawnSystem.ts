import { getComponentStruct } from '../../lib/ECS/Entity';
import { addEntity, getEntities } from '../../lib/ECS/Heap';
import Enumerable from '../../lib/linq';
import { DialogID } from '../Components/Dialogs/data';
import { DirectionComponentID } from '../Components/DirectionComponent';
import { TilesMatrix, TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { Tile } from '../Components/Matrix/TilesMatrix/def';
import {
    PlayerStoryComponentID,
    PlayerStoryStep,
} from '../Components/PlayerStoryProgress';
import { PositionComponentID } from '../Components/Position';
import { TypeComponentID } from '../Components/Type';
import {
    HALF_CARD_SIZE,
    HALF_RENDER_CARD_SIZE,
    RENDER_CARD_SIZE,
} from '../CONST';
import { CardEntityID } from '../Entities/Card';
import { GameStoryEntityID } from '../Entities/GameStory';
import {
    createNpcEntity,
    NpcEntity,
    NPCEntityID,
    NPCType,
} from '../Entities/NPC';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { floor } from '../utils/math';
import { Item, rectangleIterate } from '../utils/Matrix/rectangleIterate';
import { random } from '../utils/random';
import {
    isEqualVectors,
    mapVector,
    mulVector,
    newVector,
    setVector,
    sumVector,
    Vector,
} from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';
import { CommonAction } from './ActionSystem';

export function NpcSpawnSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);

    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerDirection = getComponentStruct(
        playerEntity,
        DirectionComponentID,
    );

    ticker.addTimeInterval(() => {
        updateFirstNPC(heap, cardTiles, cardPosition, playerDirection);
    }, 1000);
}

function updateFirstNPC(
    heap: GameHeap,
    cardTiles: TilesMatrix,
    cardPosition: Vector,
    playerDirection: Vector,
) {
    const gameStory = getEntities(heap, GameStoryEntityID)[0];
    const playerStory = getComponentStruct(gameStory, PlayerStoryComponentID);

    const NPCes = getEntities(heap, NPCEntityID);

    if (playerStory.currentStep === PlayerStoryStep.NewGame) {
        const firstNPC = NPCes.find((NPC) => {
            const type = getComponentStruct(NPC, TypeComponentID);
            return type.type === NPCType.First;
        });

        if (
            firstNPC === undefined &&
            (playerDirection.x !== 0 || playerDirection.y !== 0)
        ) {
            const npc = tryAddFirstNpc(
                cardTiles,
                cardPosition,
                playerDirection,
            );
            npc && addEntity(heap, npc);
        }
    }
}

function tryAddFirstNpc(
    cardTiles: TilesMatrix,
    cardPosition: Vector,
    playerDirection: Vector,
): undefined | NpcEntity {
    const tileItem = getRandomTile(cardTiles, playerDirection);

    if (tileItem === undefined) return;

    const npc = createNpcEntity({
        type: NPCType.First,
        action: {
            type: CommonAction.Dialog,
            dialogID: DialogID.FirstMeeting,
        },
    });
    const position = getComponentStruct(npc, PositionComponentID);

    setVector(position, sumVector(tileItem, mulVector(cardPosition, -1)));

    return npc;
}

function getRandomTile(
    cardTiles: TilesMatrix,
    playerDirection: Vector,
): Item<Tile> | undefined {
    const sx = floor(HALF_CARD_SIZE - HALF_RENDER_CARD_SIZE - 1);
    const sy = floor(HALF_CARD_SIZE - HALF_RENDER_CARD_SIZE - 1);
    const w = RENDER_CARD_SIZE + 2;
    const h = RENDER_CARD_SIZE + 2;

    return Enumerable.from(rectangleIterate(cardTiles.matrix, sx, sy, w, h))
        .where((item): item is Item<Tile> => item !== undefined)
        .firstOrDefault(({ value, x, y }) => {
            if (!value.passable) {
                return false;
            }

            const normalizedTilePosition = mapVector(
                newVector((x - sx) / w, (y - sy) / h),
                floor,
            );

            if (!isEqualVectors(normalizedTilePosition, playerDirection)) {
                return false;
            }

            return random() > 0.9;
        }, undefined);
}
