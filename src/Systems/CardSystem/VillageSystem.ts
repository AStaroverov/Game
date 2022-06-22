import { ExtractStruct } from '../../../lib/ECS/Component';
import { TilesMatrixComponent } from '../../Components/Matrix/TilesMatrix';
import { Tile, TileEnv, TileType } from '../../Components/Matrix/TilesMatrix/def';
import { getRenderMatrixSide } from '../../Components/Matrix/TilesMatrix/fillers/utils/getRenderMatrixSide';
import { isLastRoadTile } from '../../Components/Matrix/TilesMatrix/fillers/utils/is';
import { mergeMatrix } from '../../Components/Matrix/TilesMatrix/fillers/utils/mergeMatrix';
import { createVillage } from '../../Components/Matrix/TilesMatrix/fillers/village';
import { TVillage, Village, VillagesComponent } from '../../Components/Villages';
import {
    CARD_RECT,
    CARD_SIZE,
    PLAYER_START_POSITION,
    RENDER_CARD_SIZE,
    RENDER_RECT,
} from '../../CONST';
import { getWorldRenderRect } from '../../utils/getWorldRenderRect';
import { floor } from '../../utils/math';
import { Matrix, TMatrix } from '../../utils/Matrix';
import { random, randomArbitraryInt } from '../../utils/random';
import { negateVector, TVector, Vector } from '../../utils/shape';
import { Rect } from '../../utils/shapes/rect';

export function villageSystemTick(
    cardTiles: ExtractStruct<TilesMatrixComponent>,
    cardVillages: ExtractStruct<VillagesComponent>,
    flooredCardPosition: TVector,
    playerPosition: TVector,
    playerDirection: TVector,
): void {
    const [should, sourceVillage] = shouldSpawnVillage(
        cardTiles.matrix,
        cardVillages.villages,
        playerPosition,
        playerDirection,
    );

    if (should) {
        VillagesComponent.add(
            cardVillages,
            spawnVillage(sourceVillage, cardTiles.matrix, flooredCardPosition, playerDirection),
        );
    }

    for (const village of cardVillages.villages) {
        if (shouldMergeVillage(village, flooredCardPosition)) {
            mergeVillage(cardTiles.matrix, village, flooredCardPosition);
        } else if (shouldForgetVillage(village, flooredCardPosition)) {
            Village.update(village, { matrix: null });
        }
    }
}

const INITIAL_DISTANCE = 50;
const DISTANCE_BETWEEN_VILLAGES = 300;

function shouldSpawnVillage(
    cardMatrix: TMatrix<Tile>,
    villages: TVillage[],
    playerPosition: TVector,
    playerDirection: TVector,
): [boolean, undefined | TVillage] {
    const passedEnough = Vector.distance(PLAYER_START_POSITION, playerPosition) > INITIAL_DISTANCE;
    const currentVillage = passedEnough
        ? villages.find(
              (village): boolean =>
                  Vector.distance(playerPosition, Rect.getCenter(village.area)) <
                  DISTANCE_BETWEEN_VILLAGES,
          )
        : undefined;
    const shouldUpdateCurrentVillage =
        currentVillage === undefined || currentVillage.matrix === null;
    const suitablePosition =
        shouldUpdateCurrentVillage && isSuitablePosition(cardMatrix, playerDirection);
    const shouldSpawnVillage = suitablePosition && random() > 0.9;

    return [shouldSpawnVillage, currentVillage];
}

function isSuitablePosition(cardMatrix: TMatrix<Tile>, playerDirection: TVector): boolean {
    const forwardMatrix = Matrix.getSide(
        cardMatrix,
        playerDirection,
        floor((CARD_SIZE - RENDER_CARD_SIZE) / 2),
    );

    const renderedMatrix = getRenderMatrixSide(cardMatrix, playerDirection, 1);

    return (
        Matrix.some(renderedMatrix, (tile) => tile.type === TileType.road) &&
        Matrix.every(forwardMatrix, (tile) => tile.type === TileType.empty) &&
        Matrix.every(cardMatrix, (tile) => tile.env !== TileEnv.Village)
    );
}

export function spawnVillage(
    village: undefined | TVillage,
    cardMatrix: TMatrix<Tile>,
    cardPosition: TVector,
    _playerDirection: TVector,
): TVillage {
    const moves = Vector.toOneWayVectors(_playerDirection);
    const playerDirection = moves[randomArbitraryInt(0, moves.length - 1)];

    const side = getRenderMatrixSide(cardMatrix, playerDirection, 1);
    const roads = Matrix.reduce(
        side,
        [] as { tile: Tile; x: number; y: number }[],
        (acc, tile, x, y) => {
            if (isLastRoadTile(tile)) acc.push({ tile, x, y });
            return acc;
        },
    );

    if (roads.length === 0) {
        throw new Error('Card doesnt have suitable roads');
    }

    const villageMatrix = createVillage(
        village?.area.w ?? randomArbitraryInt(21, 31),
        village?.area.h ?? randomArbitraryInt(21, 31),
    );
    const villageSide = Matrix.getSide(villageMatrix, negateVector(playerDirection), 1);
    const villageRoads = Matrix.reduce(
        villageSide,
        [] as { tile: Tile; x: number; y: number }[],
        (acc, tile, x, y) => {
            if (isLastRoadTile(tile)) acc.push({ tile, x, y });
            return acc;
        },
    );

    if (villageRoads.length === 0) {
        throw new Error('Village doesnt have suitable roads');
    }

    const cardRoad = roads[randomArbitraryInt(0, roads.length - 1)];
    const villageRoad = villageRoads[randomArbitraryInt(0, villageRoads.length - 1)];

    const relX = stepNormalize(
        playerDirection.x,
        -villageMatrix.w,
        cardRoad.x - villageRoad.x,
        RENDER_CARD_SIZE,
    );
    const relY = stepNormalize(
        playerDirection.y,
        -villageMatrix.h,
        cardRoad.y - villageRoad.y,
        RENDER_CARD_SIZE,
    );
    const matrixX = RENDER_RECT.x + relX;
    const matrixY = RENDER_RECT.y + relY;

    const worldPositionShift = Vector.negate(Vector.map(cardPosition, floor));

    return Village.create({
        name: village?.name ?? String(random()),
        area: Rect.create(
            worldPositionShift.x + matrixX,
            worldPositionShift.y + matrixY,
            villageMatrix.w,
            villageMatrix.h,
        ),
        matrix: villageMatrix,
    });
}

function stepNormalize(v: number, min: number, zero: number, max: number = zero): number {
    return v === -1 ? min : v === 0 ? zero : max;
}

function shouldMergeVillage(village: TVillage, cardPosition: TVector): boolean {
    return (
        village.matrix !== null && Rect.intersect(village.area, getWorldRenderRect(cardPosition))
    );
}

function shouldForgetVillage(village: TVillage, cardPosition: TVector): boolean {
    return (
        village.matrix !== null &&
        Rect.notIntersect(
            village.area,
            Rect.create(-cardPosition.x, -cardPosition.y, CARD_RECT.w, CARD_RECT.h),
        )
    );
}

function mergeVillage(
    cardMatrix: TMatrix<Tile>,
    village: TVillage,
    flooredCardPosition: TVector,
): void {
    const x = village.area.x + flooredCardPosition.x;
    const y = village.area.y + flooredCardPosition.y;

    mergeMatrix(cardMatrix, village.matrix!, x, y, (target, source) => {
        target.env = source.env;
        target.type = source.type;
        return target;
    });
}
