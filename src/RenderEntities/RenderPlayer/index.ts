import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    TextureLoader,
} from 'three';

import atlasDataPlayer from '../../../assets/atlases/player_idle.json';
import atlasPlayer from '../../../assets/atlases/player_idle.png';
import { RenderEntity } from '../../types';
import { Point } from '../../utils/shape';

type Props = Point;

export class RenderPlayer implements RenderEntity<Props> {
    mesh: Mesh<BoxGeometry, MeshBasicMaterial>;

    constructor(props: Props) {
        const geometry = new BoxGeometry(
            atlasDataPlayer.frames['player (1).png'].frame.w * 3,
            atlasDataPlayer.frames['player (1).png'].frame.h * 3,
            20,
        );
        const material = new MeshBasicMaterial({ transparent: true });
        this.mesh = new Mesh(geometry, material);

        this.setTexture();
        this.update(props);
    }

    setTexture(): void {
        const texturePlayer = new TextureLoader().load(atlasPlayer);
        const { meta } = atlasDataPlayer;
        const { frame } = atlasDataPlayer.frames['player (1).png'];
        texturePlayer.magFilter = NearestFilter;
        texturePlayer.minFilter = NearestFilter;
        texturePlayer.anisotropy = 0;
        texturePlayer.offset.x = frame.x;
        texturePlayer.offset.y = frame.y;
        texturePlayer.repeat.x = frame.w / meta.size.w;
        texturePlayer.repeat.y = frame.h / meta.size.h;

        this.mesh.material.map = texturePlayer;
    }

    render(): void {
        //
    }

    update({ x, y }: Pick<Props, 'x' | 'y'>): void {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
    }
}
