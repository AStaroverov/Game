import { CARD_SIZE, TILE_SIZE } from '../CONST';
import { TVector } from './shape';

const minZ = 1e5;

export function worldYToPositionZ(y: number): number {
    return minZ + y / TILE_SIZE;
}

export function worldPositionToZIndex(p: TVector): number {
    return minZ + p.y / TILE_SIZE + p.x / (TILE_SIZE * CARD_SIZE);
}
