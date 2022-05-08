import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { newVector, sumVector, Vector } from './shape';

const OFFSET = -(CARD_SIZE - RENDER_CARD_SIZE) / 2;
const OFFSET_VECTOR = newVector(OFFSET, OFFSET);

export function worldPositionToRenderPosition(
    world: Vector,
    card: Vector,
): Vector {
    return sumVector(card, world, OFFSET_VECTOR);
}
