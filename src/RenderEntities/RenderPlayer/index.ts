import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

import { RenderEntity } from '../../types';
import { Point } from '../../utils/shape';

type Props = Point;

export class RenderPlayer implements RenderEntity<Props> {
    mesh: Mesh;

    constructor(props: Props) {
        const geometry = new BoxGeometry(20, 20, 20);
        const material = new MeshBasicMaterial({ color: 0 });
        this.mesh = new Mesh(geometry, material);

        this.update(props);
    }

    render(): void {
        //
    }

    update({ x, y }: Pick<Props, 'x' | 'y'>): void {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
    }
}
