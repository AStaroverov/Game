import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

import dataAtlasPlayer from '../../../assets/atlases/player_idle.json';
import imageAtlasPlayer from '../../../assets/atlases/player_idle.png';
import { Atlas } from '../../../lib/Atlas';
import { RenderEntity } from '../../types';
import { Point } from '../../utils/shape';

type Props = Point;

export const atlasPlayer = new Atlas(imageAtlasPlayer, dataAtlasPlayer);

export class RenderPlayer implements RenderEntity<Props> {
    mesh: Mesh<BoxGeometry, MeshBasicMaterial>;

    constructor() {
        const geometry = new BoxGeometry(
            atlasPlayer.w * 3,
            atlasPlayer.h * 3,
            20,
        );
        const material = new MeshBasicMaterial({ transparent: true });
        this.mesh = new Mesh(geometry, material);
    }
}
