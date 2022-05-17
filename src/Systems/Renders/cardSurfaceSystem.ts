import { Color, TextureLoader } from 'three';

import imageGrass from '../../../assets/sprites/tilesets/grass.png';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { getMatrixCell, getMatrixSlice } from '../../Components/Matrix/Matrix';
import { SurfaceMeshesMatrixID } from '../../Components/Matrix/SurfaceMeshesMatrixComponent';
import { TilesMatrixID } from '../../Components/Matrix/TilesMatrix';
import { PositionComponentID } from '../../Components/Position';
import { RENDER_CARD_SIZE, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { PlayerEntityID } from '../../Entities/Player';
import { GameHeap } from '../../heap';
import { floor, round, ufloor } from '../../utils/math';
import { getRandomArbitrary } from '../../utils/random';
import { mapVector, newVector, sumVector } from '../../utils/shape';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';

const RENDER_RADIUS = Math.floor(RENDER_CARD_SIZE / 2);
const TEXTURE_GRASS = new TextureLoader().load(imageGrass);

export function cardSurfaceSystem(
    heap: GameHeap,
    ticker: TasksScheduler,
): void {
    const playerEntity = getEntities(heap, PlayerEntityID)[0];
    const cardEntity = getEntities(heap, CardEntityID)[0];

    const playerPosition = getComponentStruct(
        playerEntity,
        PositionComponentID,
    );
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardTiles = getComponentStruct(cardEntity, TilesMatrixID);
    const cardMeshes = getComponentStruct(cardEntity, SurfaceMeshesMatrixID);

    ticker.addFrameInterval(updateSurface, 1);

    const tileIndexToSalt = new Map<number, { color: Color }>();

    function getSalt(n: number): { color: Color } {
        if (!tileIndexToSalt.has(n)) {
            const v = getRandomArbitrary(0.96, 1);
            tileIndexToSalt.set(n, { color: new Color(v, v, v) });
        }

        return tileIndexToSalt.get(n)!;
    }

    function updateSurface() {
        const abs = mapVector(sumVector(playerPosition, cardPosition), round);
        const fractionPosition = newVector(
            -cardPosition.x % 1,
            -cardPosition.y % 1,
        );
        const uflooredPosition = mapVector(cardPosition, ufloor);

        getMatrixSlice(cardTiles, abs.x, abs.y, RENDER_RADIUS).forEach(
            (tile, x, y) => {
                const mesh = getMatrixCell(cardMeshes, x, y);

                if (tile && mesh) {
                    mesh.visible = true;
                    mesh.position.x = floor(
                        (x - fractionPosition.x) * TILE_SIZE,
                    );
                    mesh.position.y = floor(
                        (y - fractionPosition.y) * TILE_SIZE,
                    );

                    const index =
                        x +
                        y * RENDER_CARD_SIZE -
                        (uflooredPosition.x +
                            uflooredPosition.y * RENDER_CARD_SIZE);
                    const salt = getSalt(index);

                    if (mesh.material.color !== salt.color) {
                        mesh.material.color = salt.color;
                    }

                    if (mesh.material.map !== TEXTURE_GRASS) {
                        mesh.material.map = TEXTURE_GRASS;
                        mesh.material.needsUpdate = true;
                    }
                } else if (mesh) {
                    mesh.visible = false;
                }
            },
        );
    }
}
