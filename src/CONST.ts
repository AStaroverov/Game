import { newVector } from './utils/shape';

export const TILE_SIZE = 64;

export const CARD_SIZE = 61;
export const RENDER_CARD_SIZE = 21;

export const START_POSITION = newVector(
    Math.floor(CARD_SIZE / 2),
    Math.floor(CARD_SIZE / 2),
);

export const ACTION_DELAY = 150;
