import { CARD_SIZE } from '../CONST';
import { Vector } from './shape';

export function isInsideCard(v: Vector): boolean {
    return v.x > 0 && v.x < CARD_SIZE && v.y > 0 && v.y < CARD_SIZE;
}
