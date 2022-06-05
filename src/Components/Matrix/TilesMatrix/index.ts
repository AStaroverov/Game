import { createComponent, ReturnStruct } from '../../../../lib/ECS/Component';
import { Matrix, TMatrix } from '../../../utils/Matrix';
import { crossIterate } from '../../../utils/Matrix/crossIterate';
import { random } from '../../../utils/random';
import { isEqualVectors, Size, Vector } from '../../../utils/shape';
import { createMatrixComponent } from '../Matrix';
import { Tile, TileEnv, TileType } from './def';

const GET_EMPTY_TILE = (): Tile => ({
    env: TileEnv.Empty,
    type: TileType.empty,
    passable: false,
});

export const TilesMatrixID = 'TILES_MATRIX' as const;
export type TilesMatrix = ReturnStruct<typeof createTilesMatrixComponent>;
export const createTilesMatrixComponent = (props: Size) =>
    createComponent(
        TilesMatrixID,
        createMatrixComponent({ ...props, seed: GET_EMPTY_TILE }),
    );

export function updateTile(target: Tile, source: Partial<Tile>) {
    Object.assign(target, source);
}

export function getMatrixTile(
    matrix: TilesMatrix['matrix'],
    vec: Vector,
): undefined | Tile {
    return Matrix.get(matrix, vec.x, vec.y);
}

export function setMatrixTile(
    matrix: TilesMatrix['matrix'],
    vec: Vector,
    tile: Tile,
): undefined | Tile {
    return Matrix.set(matrix, vec.x, vec.y, tile);
}

export function initMatrixTiles({ matrix }: TilesMatrix, vec: Vector): void {
    for (const item of crossIterate(matrix, vec, 1)) {
        if (
            item !== undefined &&
            (random() > 0.5 || isEqualVectors(vec, item))
        ) {
            setMatrixTile(matrix, item, {
                env: TileEnv.Forest,
                type: TileType.road,
                passable: true,
            });
        }

        // if (item !== undefined && (random() > 0 || isEqualVectors(vec, item))) {
        //     setMatrixTile(matrix, item, {
        //         env: TileEnv.Forest,
        //         type: TileType.road,
        //         passable: true,
        //     });
        //
        //     if (!isEqualVectors(vec, item)) {
        //         return;
        //     }
        // }
    }
}

export function mergeTiles(
    struct: TilesMatrix,
    source: TMatrix,
    sx: number,
    sy: number,
): void {
    const target = struct.matrix;
    Matrix.forEach(source, (item, x, y) => {
        Matrix.set(target, sx + x, sy + y, item);
    });
}

export function moveTiles({ matrix }: TilesMatrix, v: Vector): void {
    const { w, h } = matrix;
    const tmp = Matrix.create<Tile>(w, h, GET_EMPTY_TILE);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            const prevTile = Matrix.get(matrix, i + v.x, j + v.y);
            prevTile && Matrix.set(tmp, i, j, prevTile);
        }
    }

    Matrix.setSource(matrix, tmp.buffer.slice());
}
