import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { newVector, sumVector, TVector } from './shape';

const OFFSET = -(CARD_SIZE - RENDER_CARD_SIZE) / 2;
const OFFSET_VECTOR = newVector(OFFSET, OFFSET);

export function worldToRenderPosition(world: TVector, card: TVector): TVector {
    return sumVector(world, card, OFFSET_VECTOR);
}
