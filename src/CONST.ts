import { newVector } from './utils/shape';

export const TILE_SIZE = 64;

export const CARD_SIZE = 61;
export const HALF_CARD_SIZE = CARD_SIZE / 2;
export const CENTER_CARD_POSITION = newVector(
    Math.floor(HALF_CARD_SIZE),
    Math.floor(HALF_CARD_SIZE),
);

export const RENDER_CARD_SIZE = 21;
export const HALF_RENDER_CARD_SIZE = RENDER_CARD_SIZE / 2;
export const CENTER_RENDER_POSITION = newVector(
    Math.floor(HALF_RENDER_CARD_SIZE),
    Math.floor(HALF_RENDER_CARD_SIZE),
);
