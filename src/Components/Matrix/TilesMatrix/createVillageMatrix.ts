import { Matrix, TMatrix } from '../../../utils/Matrix';
import { Tile, TileEnv, TileSubtype, TileType } from './def';

type VillageTile = Tile<TileEnv.Village>;
type VillageMatrix = TMatrix<VillageTile>;

export function createVillageMatrix(w: number, h: number): VillageMatrix {
    const matrix = Matrix.create<VillageTile>(w, h, () => {
        return {
            env: TileEnv.Village,
            type: TileType.passable,
            subtype: TileSubtype.road,
        };
    });

    return matrix;
}
