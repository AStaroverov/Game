import Enumerable from '../../../../../lib/linq';
import { floor } from '../../../../utils/math';
import { Matrix } from '../../../../utils/Matrix';
import { crossIterate } from '../../../../utils/Matrix/crossIterate';
import { Item, radialIterate } from '../../../../utils/Matrix/radialIterate';
import { negateVector, sumVector } from '../../../../utils/shape';
import { Tile, TileEnv, TileType } from '../def';
import { setMatrixTile, TilesMatrix } from '../index';

export function fillRoads({ matrix }: TilesMatrix): void {
    Enumerable.from(
        radialIterate(matrix, floor(matrix.h / 2), floor(matrix.w / 2)),
    )
        .skip(1)
        .where((item): item is Item<Tile> => item?.value.type === TileType.road)
        .forEach((item) => {
            Enumerable.from(crossIterate(matrix, item, 1))
                .where((item): item is Item<Tile> => {
                    return (
                        item !== undefined && item.value.type === TileType.road
                    );
                })
                .skip(1)
                .forEach((roadItem) => {
                    const relVector = sumVector(negateVector(roadItem), item);
                    const resultVector = sumVector(item, relVector);
                    const matrixTile = Matrix.get(
                        matrix,
                        resultVector.x,
                        resultVector.y,
                    );

                    if (matrixTile?.type === TileType.empty) {
                        setMatrixTile(matrix, resultVector, {
                            env: TileEnv.Forest,
                            type: TileType.road,
                            passable: true,
                        });
                    }
                });
        });
}
