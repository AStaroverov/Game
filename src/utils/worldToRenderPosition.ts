import { CARD_SIZE, RENDER_CARD_SIZE } from '../CONST';
import { TVector, Vector } from './shape';

const OFFSET = -(CARD_SIZE - RENDER_CARD_SIZE) / 2;
const OFFSET_VECTOR = Vector.create(OFFSET, OFFSET);

export function worldToRenderPosition(world: TVector, card: TVector): TVector {
    return Vector.sum(world, card, OFFSET_VECTOR);
}
