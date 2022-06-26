import { getComponentStruct } from '../../lib/ECS/Entity';
import { addEntity, deleteEntities, getEntities } from '../../lib/ECS/Heap';
import { Tile } from '../Components/Matrix/TilesMatrix/def';
import { isBuildingTile } from '../Components/Matrix/TilesMatrix/fillers/utils/is';
import {
    matchBuilding,
    matchNotBuilding,
    matchRoad,
} from '../Components/Matrix/TilesMatrix/fillers/utils/patterns';
import { PositionComponentID } from '../Components/Position';
import { TVillageActive, Village, VillagesComponentID } from '../Components/Villages';
import { CardEntityID } from '../Entities/Card';
import { createHouseEntity, HouseEntityID } from '../Entities/House';
import { GameHeap } from '../heap';
import { isInsideWorldRenderRect } from '../utils/isInsideWorldRenderRect';
import { Matrix, TMatrix } from '../utils/Matrix';
import { ItemMatchReplace } from '../utils/Matrix/methods/matchReplace';
import { flipX } from '../utils/Matrix/methods/transform';
import { range } from '../utils/range';
import { Size, TSize, TVector, Vector } from '../utils/shape';
import { TasksScheduler } from '../utils/TasksScheduler/TasksScheduler';

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
    ...createBuildingPattern(5, 3, (m) => [m, flipX(m)]),
    ...createBuildingPattern(4, 4),
    ...createBuildingPattern(5, 4, (m) => [m, flipX(m)]),
    /* eslint-enable */
];

export function VillageSpawnSystem(heap: GameHeap, ticker: TasksScheduler) {
    const cardEntity = getEntities(heap, CardEntityID)[0];
    const cardPosition = getComponentStruct(cardEntity, PositionComponentID);
    const cardVillages = getComponentStruct(cardEntity, VillagesComponentID);

    ticker.addFrameInterval(update, 1);

    function update() {
        const village = cardVillages.villages.find((v) =>
            isInsideWorldRenderRect(v.area, cardPosition),
        );

        if (cardVillages.currentVillageName !== village?.name) {
            cardVillages.currentVillageName = village?.name;
            unspawn();

            if (village !== undefined && Village.isActive(village)) {
                spawn(village);
            }
        }
    }

    function unspawn() {
        deleteEntities(heap, HouseEntityID);
    }

    function spawn(village: TVillageActive) {
        const housePlaces = Matrix.matchAll(village.matrix, buildingPatterns);

        for (const place of housePlaces) {
            const tile = Matrix.get(place, 0, 0)!;
            const size = getBuildingAreaSize(place);
            const position = Vector.sum(village.area, tile, Vector.create(size.w / 2, size.h / 2));
            const houseEntity = createHouseEntity(position, size);

            addEntity(heap, houseEntity);
        }
    }
}

function getBuildingAreaSize(matrix: TMatrix<Tile>): TSize {
    let min: undefined | TVector = undefined;
    let max: undefined | TVector = undefined;

    Matrix.forEach(matrix, (item, x, y) => {
        if (!isBuildingTile(item)) return;

        min = min || Vector.create(x, y);
        max = Vector.create(x, y);
    });

    return Size.fromVector(Vector.sum(max!, Vector.negate(min!), Vector.UP, Vector.RIGHT));
}
