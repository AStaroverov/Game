import { Color, NearestFilter, Texture } from 'three';

import dataAtlasGross from '../../../assets/atlases/gross_1.json';
import imageAtlasGross from '../../../assets/atlases/gross_1.png';
import dataAtlasRoad from '../../../assets/atlases/road_1.json';
import imageAtlasRoad from '../../../assets/atlases/road_1.png';
import { Atlas } from '../../../lib/Atlas';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { getMatrixCell, getMatrixSlice } from '../../Components/Matrix/Matrix';
import { SurfaceMeshesMatrixID } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { TileType } from '../../Components/Matrix/TilesMatrix/def';
import { PositionComponentID } from '../../Components/Position';
import { $ref, RENDER_CARD_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { floor, round } from '../../utils/math';
import { Matrix } from '../../utils/Matrix';
import { randomArbitraryFloat, randomArbitraryInt } from '../../utils/random';
import { mapVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const RENDER_RADIUS = Math.floor(RENDER_CARD_SIZE / 2);

const atlasGross = new Atlas(imageAtlasGross, dataAtlasGross);
const grossTextures = atlasGross.list.map((f) => f.texture);
atlasGross.list.forEach((frame) => (frame.texture.magFilter = NearestFilter));

const atlasRoad = new Atlas(imageAtlasRoad, dataAtlasRoad);
const roadTextures = (() => {
    const max = 224;
    const offset = 64;
    return atlasRoad.list
        .filter((frame) => {
            return (
                frame.x >= offset &&
                frame.x <= max - offset &&
                frame.y >= offset &&
                frame.y <= max - offset
            );
        })
        .map((f) => f.texture);
})();
atlasRoad.list.forEach((frame) => (frame.texture.magFilter = NearestFilter));

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
                        tile.type === TileType.road ? roadTextures : grossTextures,
                    );

                    if (mesh.material.map !== meta.texture) {
                        mesh.material.map = meta.texture;
                        mesh.material.needsUpdate = true;
                    }

                    // // Debug render
                    // if (isRoadTile(tile)) {
                    //     mesh.material.color = tile.last
                    //         ? new Color(0, 255, 0)
                    //         : new Color(255, 255, 255);
                    // } else {
                    //     mesh.material.color = new Color(1, 1, 1);
                    // }
                    // if (tile.type === TileType.building) {
                    //     mesh.material.color = new Color(255, 255, 255);
                    //     mesh.material.map = null;
                    //     mesh.material.needsUpdate = true;
                    // }
                }
            },
        );
    }
}

type TSurfaceMeta = { color: Color; texture: Texture };

const tileIndexToMeta = new Map<string, TSurfaceMeta>();

function getMeta(n: string, textures: Texture[]): TSurfaceMeta {
    if (!tileIndexToMeta.has(n)) {
        const v = randomArbitraryFloat(0.96, 1);

        tileIndexToMeta.set(n, {
            color: new Color(v, v, v),
            texture: textures[randomArbitraryInt(0, textures.length - 1)],
        });
    }

    return tileIndexToMeta.get(n)!;
}
