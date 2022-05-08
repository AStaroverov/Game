import { RENDER_CARD_SIZE, TILE_SIZE } from '../CONST';

export function tileYToPositionZ(y: number): number {
    return RENDER_CARD_SIZE - y;
}

export function worldYToPositionZ(y: number): number {
    return RENDER_CARD_SIZE - y / TILE_SIZE;
}
