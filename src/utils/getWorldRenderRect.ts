import { RENDER_RECT } from '../CONST';
import { TVector } from './shape';
import { Rect, TRect } from './shapes/rect';

export function getWorldRenderRect(cardPosition: TVector): TRect {
    return Rect.create(
        RENDER_RECT.x - cardPosition.x,
        RENDER_RECT.y - cardPosition.y,
        RENDER_RECT.w,
        RENDER_RECT.h,
    );
}
