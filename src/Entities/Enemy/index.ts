import { MeshBasicMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlasPlayer from '../../../assets/atlases/player_idle.json';
import imageAtlasPlayer from '../../../assets/atlases/player_idle.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/entities';
import { AtlasAnimationComponent } from '../../Components/AtlasAnimationComponent';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { VelocityComponent } from '../../Components/VelocityComponent';

export const atlasPlayer = new Atlas(imageAtlasPlayer, dataAtlasPlayer);

atlasPlayer.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class EnemyEntity extends createEntity(() => [
    new PositionComponent(),
    new DirectionComponent(),
    new VelocityComponent(),
    new MeshBasicComponent({
        geometry: new PlaneGeometry(atlasPlayer.w * 3, atlasPlayer.h * 3),
        material: new MeshBasicMaterial({ transparent: true, alphaTest: 0.5 }),
    }),
    new AtlasAnimationComponent({
        time: 0,
        duration: 100,
        atlas: atlasPlayer,
    }),
]) {}

export function isEnemyEntity<T = EnemyEntity>(
    entity: EnemyEntity | unknown,
): entity is EnemyEntity {
    return entity instanceof EnemyEntity;
}
