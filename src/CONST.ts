import { mapVector, newVector } from './utils/shape';

export const GAME_VERSION = 0;

export const TILE_SIZE = 64;

export const CARD_SIZE = 61;
export const HALF_CARD_SIZE = CARD_SIZE / 2;
export const CENTER_CARD_POSITION = newVector(
    Math.floor(HALF_CARD_SIZE),
    Math.floor(HALF_CARD_SIZE),
);

export const RENDER_CARD_SIZE = 11;
export const HALF_RENDER_CARD_SIZE = RENDER_CARD_SIZE / 2;
export const CENTER_RENDER_POSITION = newVector(
    Math.floor(HALF_RENDER_CARD_SIZE),
    Math.floor(HALF_RENDER_CARD_SIZE),
);

export const PLAYER_START_POSITION = mapVector(
    CENTER_CARD_POSITION,
    (v) => v + 0.5,
);

export const DIALOG_Z = 110;
export const HEAL_BAR_Z = 100;

export const $ref = Symbol('REF');
