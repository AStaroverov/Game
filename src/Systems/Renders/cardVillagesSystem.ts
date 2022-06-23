import { Mesh, MeshLambertMaterial, PlaneGeometry, Texture, TextureLoader } from 'three';

import house_4x3_1 from '../../../assets/sprites/houses/houses_128x144_1.png';
import house_4x3_2 from '../../../assets/sprites/houses/houses_128x144_2.png';
import house_4x4_1 from '../../../assets/sprites/houses/houses_128x184_1.png';
import house_4x4_2 from '../../../assets/sprites/houses/houses_128x192_2.png';
import house_5x4_1 from '../../../assets/sprites/houses/houses_160x192_2.png';
import house_5x4_2 from '../../../assets/sprites/houses/houses_160x192_2.png';
import { getComponentStruct } from '../../../lib/ECS/Entity';
import { getEntities } from '../../../lib/ECS/Heap';
import { Tile } from '../../Components/Matrix/TilesMatrix/def';
import { isBuildingTile } from '../../Components/Matrix/TilesMatrix/fillers/utils/is';
import {
    matchBuilding,
    matchNotBuilding,
    matchRoad,
} from '../../Components/Matrix/TilesMatrix/fillers/utils/patterns';
import { PositionComponentID } from '../../Components/Position';
import { TVillage, VillagesComponentID } from '../../Components/Villages';
import { CARD_START_DELTA, RENDER_RECT, TILE_SIZE } from '../../CONST';
import { CardEntityID } from '../../Entities/Card';
import { GameHeap } from '../../heap';
import { getWorldRenderRect } from '../../utils/getWorldRenderRect';
import { Matrix, TMatrix } from '../../utils/Matrix';
import { ItemMatchReplace } from '../../utils/Matrix/methods/matchReplace';
import { flipX } from '../../utils/Matrix/methods/transform';
import { worldYToPositionZ } from '../../utils/positionZ';
import { randomArbitraryInt } from '../../utils/random';
import { range } from '../../utils/range';
import { TVector, Vector } from '../../utils/shape';
import { Rect } from '../../utils/shapes/rect';
import { TasksScheduler } from '../../utils/TasksScheduler/TasksScheduler';
import { createMeshStore } from '../MeshSystem';

const PROMISE_TEX_HOUSE_4x4_1 = new TextureLoader().loadAsync(house_4x4_1);
const PROMISE_TEX_HOUSE_4x3_1 = new TextureLoader().loadAsync(house_4x3_1);
const PROMISE_TEX_HOUSE_4x3_2 = new TextureLoader().loadAsync(house_4x3_2);
const PROMISE_TEX_HOUSE_4x4_2 = new TextureLoader().loadAsync(house_4x4_2);
const PROMISE_TEX_HOUSE_5x4_1 = new TextureLoader().loadAsync(house_5x4_1);
const PROMISE_TEX_HOUSE_5x4_2 = new TextureLoader().loadAsync(house_5x4_2);

const createBuildingPattern = (
    s1: number,
    s2: number,
    getAllVariants = Matrix.getAllVariants,
): TMatrix<ItemMatchReplace<Tile>>[] => {
    const topBottomRow = range(s1 + 2).map(() => matchNotBuilding);
    const centerRow = [matchRoad, ...range(s1).map(() => matchBuilding), matchNotBuilding];
    const pattern = Matrix.fromNestedArray([
        /* eslint-disable */
        topBottomRow,
        ...range(s2).map(() => centerRow),
        topBottomRow
        /* eslint-enable */
    ]);

    return getAllVariants(pattern);
};

const buildingPatterns = [
    /* eslint-disable */
    ...createBuildingPattern(4, 3, (m) => [m, flipX(m)]),
    ...createBuildingPattern(4, 4),
    ...createBuildingPattern(5, 4, (m) => [m, flipX(m)]),
    /* eslint-enable */
];

export async function CardVillagesSystem(heap: GameHeap, ticker: TasksScheduler) {
    const [
        TEX_HOUSE_4x3_1,
        TEX_HOUSE_4x3_2,
        TEX_HOUSE_4x4_1,
        TEX_HOUSE_4x4_2,
        TEX_HOUSE_5x4_1,
        TEX_HOUSE_5x4_2,
    ] = await Promise.all([
        PROMISE_TEX_HOUSE_4x3_1,
        PROMISE_TEX_HOUSE_4x3_2,
        PROMISE_TEX_HOUSE_4x4_1,
        PROMISE_TEX_HOUSE_4x4_2,
        PROMISE_TEX_HOUSE_5x4_1,
        PROMISE_TEX_HOUSE_5x4_2,
    ]);
    const texturesMap = {
        [getImageKey(4, 3)]: [TEX_HOUSE_4x3_1, TEX_HOUSE_4x3_2],
        [getImageKey(4, 4)]: [TEX_HOUSE_4x4_1, TEX_HOUSE_4x4_2],
        [getImageKey(5, 4)]: [TEX_HOUSE_5x4_1, TEX_HOUSE_5x4_2],
    };

    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardMeshes = createMeshStore(cardEntity);
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardVillages = getComponentStruct(cardEntity, VillagesComponentID);

    ticker.addFrameInterval(updateVillages, 1);

    let places: undefined | TMatrix<Tile>[] = undefined;

    function updateVillages() {
        const village = cardVillages.villages.find((v) => isCurrentVillage(v, cardPosition));

        if (village === undefined || village.matrix === null) {
            cardMeshes.clear();
            places = undefined;
        } else {
            places = places ?? Matrix.matchAll(village.matrix, buildingPatterns);

            for (const place of places) {
                const tile = Matrix.get(place, 1, 1)!;
                const size = getBuildingAreaSize(place);

                const mesh = cardMeshes.getset(
                    getTileKey(tile.x, tile.y),
                    createRandomHouseMesh.bind(null, texturesMap, size.x, size.y),
                ) as Mesh<PlaneGeometry, MeshLambertMaterial>;
                const tileWorldPosition = Vector.create(
                    village.area.x + tile.x,
                    village.area.y + tile.y,
                );
                const renderDelta = Vector.create(
                    cardPosition.x + CARD_START_DELTA.x - RENDER_RECT.x - 1, // wtf 1?
                    cardPosition.y + CARD_START_DELTA.y - RENDER_RECT.y - 1,
                );
                const image = mesh.material.map?.image;
                const imageDelta = Vector.create((image.width ?? 0) / 2, (image.height ?? 0) / 2);

                mesh.position.x = (tileWorldPosition.x + renderDelta.x) * TILE_SIZE + imageDelta.x;
                mesh.position.y = (tileWorldPosition.y + renderDelta.y) * TILE_SIZE + imageDelta.y;
                mesh.position.z = worldYToPositionZ(mesh.position.y);
            }
        }
    }
}

function isCurrentVillage(village: TVillage, cardPosition: TVector): boolean {
    return Rect.intersect(village.area, getWorldRenderRect(cardPosition));
}

function getTileKey(x: number, y: number): string {
    return 'HOUSE:' + x + '-' + y;
}

function getImageKey(x: number, y: number): string {
    return 'IMAGE:' + x + '-' + y;
}

function getBuildingAreaSize(matrix: TMatrix<Tile>): TVector {
    let min: undefined | TVector = undefined;
    let max: undefined | TVector = undefined;

    Matrix.forEach(matrix, (item, x, y) => {
        if (!isBuildingTile(item)) return;

        min = min || Vector.create(x, y);
        max = Vector.create(x, y);
    });

    return Vector.sum(max!, Vector.negate(min!), Vector.UP, Vector.RIGHT);
}

function createRandomHouseMesh(
    texturesMap: Record<string, Texture[]>,
    w: number,
    h: number,
): Mesh<PlaneGeometry, MeshLambertMaterial> {
    const list = texturesMap[getImageKey(w, h)];

    return createHouseMesh(list[randomArbitraryInt(0, list.length - 1)]);
}

function createHouseMesh(texture: Texture): Mesh<PlaneGeometry, MeshLambertMaterial> {
    return new Mesh(
        new PlaneGeometry(texture.image.width, texture.image.height),
        new MeshLambertMaterial({
            map: texture,
            alphaTest: 0.5,
            transparent: true,
        }),
    );
}
