import { getWorldRenderRect } from './getWorldRenderRect';
import { TVector } from './shape';
import { Rect, TRect } from './shapes/rect';

export function isInsideWorldRenderRect(area: TRect, cardPosition: TVector): boolean {
    return Rect.intersect(area, getWorldRenderRect(cardPosition));
}
