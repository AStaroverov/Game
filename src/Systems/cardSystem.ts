import { ExtractStruct } from '../../lib/ECS/Component';
import { getComponentStruct } from '../../lib/ECS/Entity';
import { getEntities } from '../../lib/ECS/Heap';
import { moveTiles, TilesMatrixID } from '../Components/Matrix/TilesMatrix';
import { Tile, TileEnv, TileType } from '../Components/Matrix/TilesMatrix/def';
import { updateEnvironment } from '../Components/Matrix/TilesMatrix/fillers/environment';
import { updateRoads } from '../Components/Matrix/TilesMatrix/fillers/roads';
import { getRenderMatrixSide } from '../Components/Matrix/TilesMatrix/fillers/utils/getRenderMatrixSide';
import {
    createVillage,
    createVillageMerger,
    IVillageMerger,
} from '../Components/Matrix/TilesMatrix/fillers/village';
import { PositionComponentID } from '../Components/Position';
import {
    createVillageStruct,
    setVillage,
    Village,
    VillagesComponent,
    VillagesComponentID,
} from '../Components/Villages';
import { CARD_SIZE, CENTER_CARD_POSITION, RENDER_CARD_SIZE } from '../CONST';
import { CardEntityID } from '../Entities/Card';
import { PlayerEntityID } from '../Entities/Player';
import { GameHeap } from '../heap';
import { abs, floor, min } from '../utils/math';
import { Matrix, TMatrix } from '../utils/Matrix';
import { random, randomArbitraryInt } from '../utils/random';
import { mapVector, mulVector, setVector, Size, sumVector, TVector, Vector } from '../utils/shape';
import { Rect } from '../utils/shapes/rect';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

export function cardSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardVillages = getComponentStruct(cardEntity, VillagesComponentID);

    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const playerPosition = getComponentStruct(playerEntity, PositionComponentID);
    const stepBetweenVillages = Vector.copy(Vector.ZERO);

    ticker.addFrameInterval(moveCard, 1);

    let villageMerger: IVillageMerger | undefined = undefined;

    function moveCard() {
        const playerPast = sumVector(playerPosition, mulVector(CENTER_CARD_POSITION, -1));

        const cardDelta = sumVector(playerPast, cardPosition);
        const nextCardPosition = sumVector(cardPosition, mulVector(cardDelta, -1));

        const flooredPosition = mapVector(cardPosition, floor);
        const flooredNextPosition = mapVector(nextCardPosition, floor);
        const diff = sumVector(flooredPosition, mulVector(flooredNextPosition, -1));

        if (diff.x !== 0 || diff.y !== 0) {
            moveTiles(cardTiles, diff);
            updateRoads(cardTiles.matrix, diff);
            updateEnvironment(cardTiles.matrix, diff);

            updateVillages(cardVillages, playerPosition);

            if (
                shouldSpawnVillage(
                    stepBetweenVillages,
                    cardTiles.matrix,
                    cardPosition,
                    playerPosition,
                    diff,
                )
            ) {
                const villageMatrix = createVillage(
                    randomArbitraryInt(21, 31),
                    randomArbitraryInt(21, 31),
                );

                villageMerger = createVillageMerger(
                    cardTiles.matrix,
                    villageMatrix,
                    playerPosition,
                    diff,
                );

                Vector.set(stepBetweenVillages, Vector.ZERO);
            }

            if (villageMerger?.shouldMerge(playerPosition)) {
                villageMerger?.merge(playerPosition);
            }
        }

        setVector(cardPosition, nextCardPosition);
    }
}

function updateVillages(villagesStruct: ExtractStruct<VillagesComponent>, playerPosition: TVector) {
    const { villages } = villagesStruct;
    const shouldAddVillage = suitableVillage(playerPosition, villages) === undefined;

    if (!shouldAddVillage) return;

    const leftVillage = getClosestVillage(villages, playerPosition, Vector.LEFT);
    const downVillage = getClosestVillage(villages, playerPosition, Vector.DOWN);
    const upVillage = getClosestVillage(villages, playerPosition, Vector.UP);
    const rightVillage = getClosestVillage(villages, playerPosition, Vector.RIGHT);

    const x = floor(
        leftVillage === undefined ? removeTail(playerPosition.x, 100) : leftVillage.area.mx,
    );
    const y = floor(
        downVillage === undefined ? removeTail(playerPosition.y, 100) : downVillage.area.my,
    );
    const w = floor(rightVillage === undefined ? 100 : rightVillage.area.x - x);
    const h = floor(upVillage === undefined ? 100 : upVillage.area.y - y);
    // debugger;

    setVillage(
        villagesStruct,
        createVillageStruct({
            name: random().toFixed(3),
            area: Rect.create(x, y, w, h),
            size: Size.create(31, 21),
            position: Vector.create(x + floor(w / 2), y + floor(h / 2)),
        }),
    );
}

function shouldSpawnVillage(
    stepBetweenVillages: TVector,
    cardMatrix: TMatrix<Tile>,
    cardPosition: TVector,
    playerPosition: TVector,
    playerDirection: TVector,
): boolean {
    const currentPosition = Vector.map(Vector.sum(playerPosition, cardPosition), floor);
    const currentTile = Matrix.get(cardMatrix, currentPosition.x, currentPosition.y);

    if (currentTile === undefined || currentTile.env === TileEnv.Village) return false;

    Vector.set(stepBetweenVillages, Vector.sum(stepBetweenVillages, playerDirection));

    console.log('>>', Vector.width(stepBetweenVillages));
    if (Vector.width(stepBetweenVillages) < 30) return false;

    const forwardMatrix = Matrix.getSide(
        cardMatrix,
        playerDirection,
        floor((CARD_SIZE - RENDER_CARD_SIZE) / 2),
    );

    const renderedMatrix = getRenderMatrixSide(cardMatrix, playerDirection, 1);

    return (
        random() > 0.9 &&
        Matrix.some(renderedMatrix, (tile) => tile.type === TileType.road) &&
        Matrix.every(forwardMatrix, (tile) => tile.type === TileType.empty) &&
        Matrix.every(cardMatrix, (tile) => tile.env !== TileEnv.Village)
    );
}

function suitableVillage(playerPosition: TVector, villages: Village[]): undefined | Village {
    return villages.find((village) => Rect.pointInside(village.area, playerPosition));
}

function getClosestVillage(
    villages: Village[],
    point: TVector,
    direction: TVector,
): undefined | Village {
    const rect = Rect.create(
        direction.x === 0 ? point.x : direction.x === -1 ? -1e9 : point.x, // x
        direction.y === 0 ? point.y : direction.y === -1 ? -1e9 : point.y, // y
        direction.x === 0 ? 0 : 1e9 + point.x, // w
        direction.y === 0 ? 0 : 1e9 + point.y, // h
    );

    return villages.reduce(
        (acc, village) => {
            if (Rect.notIntersect(rect, village.area)) return acc;

            const vertexes = Rect.getAllVertexes(village.area);
            const closestDistance = min(...vertexes.map((v) => abs(Vector.distance(v, point))));

            if (closestDistance < acc.distance) {
                acc.village = village;
                acc.distance = closestDistance;
            }

            return acc;
        },
        {
            village: undefined,
            distance: Infinity,
        } as {
            village: undefined | Village;
            distance: number;
        },
    ).village;
}

function removeTail(n: number, t: number): number {
    return n - (n % t);
}
