import { Texture } from 'pixi.js';

import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { atlases, AtlasName } from '../../Components/AtlasAnimation/atlases';
import { getMatrixCell, getMatrixSlice } from '../../Components/Matrix/Matrix';
import { SurfaceMeshesMatrixID } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { TileType } from '../../Components/Matrix/TilesMatrix/def';
import { PositionComponentID } from '../../Components/Position';
import { $ref, RENDER_CARD_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { getRandomGreyColor } from '../../utils/getRandomGreyColor';
import { floor, round } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
import { randomArbitraryInt } from '../../utils/random';
import { mapVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const RENDER_RADIUS = Math.floor(RENDER_CARD_SIZE / 2);

const GROSS_TEXTURES = atlases[AtlasName.Gross].list.map((f) => f.texture);
const ROAD_TEXTURES = (() => {
    const max = 224;
    const offset = 64;
    return atlases[AtlasName.Road].list
        .filter((frame) => {
            return (
                frame.x >= offset &&
                frame.x <= max - offset &&
                frame.y >= offset &&
                frame.y <= max - offset
            );
        })
        .map(({ texture }) => texture);
})();

export function CardSurfaceSystem(heap: GameHeap, ticker: TasksScheduler): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const cardEntity = getEntities(heap, CardEntityID)[0];

    const playerPosition = getComponentStruct(playerEntity, PositionComponentID);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardMeshes = getComponentStruct(cardEntity, SurfaceMeshesMatrixID);

    ticker.addFrameInterval(updateSurface, 1);

    function updateSurface() {
        const absPosition = mapVector(sumVector(playerPosition, cardPosition), round);
        const uflooredPosition = mapVector(cardPosition, floor);

        Matrix.forEach(
            getMatrixSlice(cardTiles, absPosition.x, absPosition.y, RENDER_RADIUS),
            (tile, x, y) => {
                const cell = getMatrixCell(cardMeshes, x, y);
                const mesh = cell?.[$ref];

                if (tile && mesh && tile.type !== TileType.empty) {
                    const index =
                        x +
                        y * RENDER_CARD_SIZE -
                        (uflooredPosition.x + uflooredPosition.y * RENDER_CARD_SIZE);

                    const meta = getMeta(
                        index + tile.type,
                        tile.type === TileType.road ? ROAD_TEXTURES : GROSS_TEXTURES,
                    );

                    if (mesh.texture !== meta.texture) {
                        mesh.texture = meta.texture;
                    }

                    // Debug render
                    // if (isRoadTile(tile)) {
                    //     mesh.tint = tile.last ? 0x00ff00 : 0xffffff;
                    // } else {
                    //     mesh.tint = undefined;
                    // }

                    // if (tile.type === TileType.building) {
                    //     mesh.tint = 0xffffff;
                    // }
                }
            },
        );
    }
}

type TSurfaceMeta = { color: number; texture: Texture };

const tileIndexToMeta = new Map<string, TSurfaceMeta>();

function getMeta(n: string, textures: Texture[]): TSurfaceMeta {
    if (!tileIndexToMeta.has(n)) {
        tileIndexToMeta.set(n, {
            color: getRandomGreyColor(),
            texture: textures[randomArbitraryInt(0, textures.length - 1)],
        });
    }

    return tileIndexToMeta.get(n)!;
}
