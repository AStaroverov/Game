import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

import { RenderEntity } from '../../types';
import { Point } from '../../utils/shape';

type Props = Point & { size: number; color: number; visible: boolean };

export class RenderTile implements RenderEntity<Props> {
    mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;

    constructor(props: Props) {
        const geometry = new PlaneGeometry(props.size, props.size);
        const material = new MeshBasicMaterial({ color: props.color });

        this.mesh = new Mesh(geometry, material);
        this.mesh.position.x = props.x;
        this.mesh.position.y = props.y;

        this.update(props);
    }

    render(): void {
        //
    }

    update({ visible, color }: Pick<Props, 'visible' | 'color'>): void {
        this.mesh.visible = visible;

        if (visible) {
            this.mesh.material.setValues({ color });
        }
    }
}
