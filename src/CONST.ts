import { floor } from './utils/math';
import { negateVector, newVector, sumVector } from './utils/shape';
import { Rect } from './utils/shapes/rect';

export const GAME_VERSION = 0;

export const TILE_SIZE = 32;

export const CARD_SIZE = 101;
export const HALF_CARD_SIZE = CARD_SIZE / 2;
export const CENTER_CARD_POSITION = newVector(
    Math.floor(HALF_CARD_SIZE),
    Math.floor(HALF_CARD_SIZE),
);

export const CARD_RECT = Rect.create(0, 0, CARD_SIZE, CARD_SIZE);

export const RENDER_CARD_SIZE = 21;
export const HALF_RENDER_CARD_SIZE = RENDER_CARD_SIZE / 2;
export const CENTER_RENDER_POSITION = newVector(
    Math.floor(HALF_RENDER_CARD_SIZE),
    Math.floor(HALF_RENDER_CARD_SIZE),
);

export const RENDER_RECT = Rect.create(
    floor((CARD_SIZE - RENDER_CARD_SIZE) / 2),
    floor((CARD_SIZE - RENDER_CARD_SIZE) / 2),
    RENDER_CARD_SIZE,
    RENDER_CARD_SIZE,
);

export const CARD_START_DELTA = newVector(-0.5, -0.5);
export const PLAYER_START_DELTA = negateVector(CARD_START_DELTA);
export const PLAYER_START_POSITION = sumVector(CENTER_CARD_POSITION, PLAYER_START_DELTA);
export const PLAYER_RENDER_START_POSITION = sumVector(CENTER_RENDER_POSITION, PLAYER_START_DELTA);

export const DIALOG_Z = 110;
export const HEAL_BAR_Z = 100;

export const $ref = Symbol('REF');
