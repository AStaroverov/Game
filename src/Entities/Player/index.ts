import { BoxGeometry, MeshBasicMaterial, NearestFilter } from 'three';

import dataAtlasPlayer from '../../../assets/atlases/player_idle.json';
import imageAtlasPlayer from '../../../assets/atlases/player_idle.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/entities';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { VelocityComponent } from '../../Components/VelocityComponent';

export const atlasPlayer = new Atlas(imageAtlasPlayer, dataAtlasPlayer);

atlasPlayer.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class PlayerEntity extends createEntity(() => [
    new PositionComponent(),
    new DirectionComponent(),
    new VelocityComponent(),
    new MeshBasicComponent({
        geometry: new BoxGeometry(atlasPlayer.w * 3, atlasPlayer.h * 3, 20),
        material: new MeshBasicMaterial({ transparent: true, alphaTest: 0.5 }),
    }),
]) {}

export function isPlayerEntity<T = PlayerEntity>(
    entity: PlayerEntity | unknown,
): entity is PlayerEntity {
    return entity instanceof PlayerEntity;
}
