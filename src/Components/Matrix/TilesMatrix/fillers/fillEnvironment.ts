import { pipe } from 'lodash/fp';

import Enumerable from '../../../../../lib/linq';
import { Item, radialIterate } from '../../../../utils/Matrix/radialIterate';
import { isPassableTileType, Tile, TileType } from '../def';
import { TilesMatrix, updateTile } from '../index';
import {
    getFromProbabilities,
    ProbabilityRecord,
    sumProbabilities,
} from './utils';

export function fillEnvironment({ matrix }: TilesMatrix): void {
    Enumerable.from(
        radialIterate(
            matrix,
            Math.floor(matrix.h / 2),
            Math.floor(matrix.w / 2),
        ),
    )
        .where(
            (item): item is Item<Tile> => item?.value.type === TileType.empty,
        )
        .forEach(({ value, x, y }) => {
            const summedProbabilities = Enumerable.from(
                radialIterate(matrix, x, y, 1),
            )
                .skip(1)
                .where((item): item is Item<Tile> => item !== undefined)
                .scan({} as ProbabilityRecord, (acc, { value, x, y }) => {
                    const newProbabilities = getTileTypeProbabilities(value);
                    return newProbabilities === undefined
                        ? acc
                        : sumProbabilities(acc, newProbabilities);
                })
                .last();

            const type = pipe(
                (probabilities: ProbabilityRecord): ProbabilityRecord => {
                    const keys = Object.keys(probabilities);
                    const sum = keys.reduce((s, k) => s + probabilities[k], 0);
                    const ratio = 1 / sum;

                    return sum === 0
                        ? probabilities
                        : keys.reduce((acc, key) => {
                              acc[key] = ratio * probabilities[key];
                              return acc;
                          }, {} as ProbabilityRecord);
                },
                getFromProbabilities(Math.random),
            )(summedProbabilities) as TileType;

            updateTile(value, {
                type,
                passable: isPassableTileType(type),
            });
        });
}

function getTileTypeProbabilities(tile: Tile): undefined | ProbabilityRecord {
    if (tile.type === TileType.road) {
        return {
            [TileType.gross]: 0.95,
            [TileType.wood]: 0.05,
        };
    }
    if (tile.type === TileType.gross) {
        return {
            [TileType.gross]: 0.97,
            [TileType.wood]: 0.03,
        };
    }
    if (tile.type === TileType.wood) {
        return {
            [TileType.gross]: 0.15,
            [TileType.wood]: 0.85,
        };
    }

    return undefined;
}
