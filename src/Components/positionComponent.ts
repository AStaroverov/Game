import { createComponent } from '../../lib/ECS/components';
import { newPoint, Point } from '../utils/shape';

export const PositionComponent = createComponent((p?: Point) => ({
    ...(p ?? newPoint(0, 0)),
}));

export function positionMove(p: Point, dx: number, dy: number): void {
    p.x += dx;
    p.y += dy;
}
