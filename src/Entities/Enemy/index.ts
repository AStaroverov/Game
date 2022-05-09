import { MeshBasicMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlas from '../../../assets/atlases/skeleton_all.json';
import imageAtlas from '../../../assets/atlases/skeleton_all.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/entities';
import { AtlasAnimationComponent } from '../../Components/AtlasAnimationComponent';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { MeshBasicComponent } from '../../Components/MeshBasicComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { VelocityComponent } from '../../Components/VelocityComponent';

export const atlas = new Atlas(imageAtlas, dataAtlas);

atlas.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class EnemyEntity extends createEntity(() => [
    new PositionComponent(),
    new DirectionComponent(),
    new VelocityComponent(),
    new MeshBasicComponent({
        geometry: new PlaneGeometry(atlas.w * 2.2, atlas.h * 2.2),
        material: new MeshBasicMaterial({ transparent: true, alphaTest: 0.5 }),
    }),
    new AtlasAnimationComponent({
        atlas,
        time: 0,
        duration: 100,
    }),
]) {}

export function isEnemyEntity<T = EnemyEntity>(
    entity: EnemyEntity | unknown,
): entity is EnemyEntity {
    return entity instanceof EnemyEntity;
}