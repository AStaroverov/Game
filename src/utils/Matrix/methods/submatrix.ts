import { newVector, Vector, zeroVector } from '../../shape';
import { Matrix, TMatrix } from '../index';
import { Item } from './utils';

export function isSubMatrix<A, B = A>(isEqual: (a: A, b: B) => boolean) {
    return function _isSubMatrix(
        matrix: TMatrix<A>,
        submatrix: TMatrix<B>,
        offset: Vector = zeroVector,
    ): boolean {
        if (submatrix.w > matrix.w || submatrix.h > matrix.h) {
            return false;
        }

        return (
            undefined ===
            Matrix.find(submatrix, (b, x, y) => {
                const a = Matrix.get(matrix, offset.x + x, offset.y + y);
                return a === undefined ? true : !isEqual(a, b);
            })
        );
    };
}

export function findSubMatrix<A, B = A>(
    isSubMatrix: (a: TMatrix<A>, b: TMatrix<B>, offset: Vector) => boolean,
) {
    return function _findSubMatrix(
        matrix: TMatrix<A>,
        submatrix: TMatrix<B>,
    ): undefined | Item<A> {
        return Matrix.find(matrix, (_, x, y) => {
            return isSubMatrix(matrix, submatrix, newVector(x, y));
        });
    };
}

export function findSubMatrices<A, B = A>(
    isSubMatrix: (a: TMatrix<A>, b: TMatrix<B>, offset: Vector) => boolean,
) {
    return function _findSubMatrices(
        matrix: TMatrix<A>,
        submatrices: TMatrix<B>[],
    ): undefined | { item: Item<A>; submatrix: TMatrix<B> } {
        for (let i = 0; i < submatrices.length; i++) {
            const submatrix = submatrices[i];
            const item = Matrix.find(matrix, (_, x, y) => {
                return isSubMatrix(matrix, submatrix, newVector(x, y));
            });

            if (item) {
                return { submatrix, item };
            }
        }
    };
}
