import { Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from 'three';

import imageFence from '../../../assets/sprites/tilesets/fences.png';
import imageGrass from '../../../assets/sprites/tilesets/grass.png';
import { ETileType } from '../../Entities/Card';
import { RenderEntity } from '../../types';
import { Point } from '../../utils/shape';

type Props = Point & { type?: ETileType; size: number; visible: boolean };

const textureGrass = new TextureLoader().load(imageGrass);
const textureFence = new TextureLoader().load(imageFence);

textureFence.repeat.set(16 / 64, 16 / 64);
textureFence.offset.x = 0.25;
textureFence.offset.y = 0;

export class RenderTile implements RenderEntity<Props> {
    mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;

    constructor(props: Props) {
        const geometry = new PlaneGeometry(props.size, props.size);
        const material = new MeshBasicMaterial({ transparent: true });

        this.mesh = new Mesh(geometry, material);
        this.mesh.position.x = props.x;
        this.mesh.position.y = props.y;

        this.update(props);
    }

    render(): void {
        //
    }

    update({ type, visible }: Pick<Props, 'visible' | 'type'>): void {
        this.mesh.visible = visible;

        if (type) {
            this.mesh.material.setValues({
                map: type === ETileType.passable ? textureGrass : textureFence,
            });
        }
    }
}
