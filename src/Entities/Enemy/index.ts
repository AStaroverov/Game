import { MeshLambertMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlas from '../../../assets/atlases/skeleton_all.json';
import imageAtlas from '../../../assets/atlases/skeleton_all.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/entities';
import { AtlasAnimationComponent } from '../../Components/AtlasAnimationComponent';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { HealBarMeshComponent } from '../../Components/HealBarMeshComponent';
import { HealComponent } from '../../Components/HealComponent';
import { MeshComponent } from '../../Components/MeshComponent';
import { PositionComponent } from '../../Components/PositionComponent';
import { VelocityComponent } from '../../Components/VelocityComponent';
import { VisualSizeComponent } from '../../Components/VisualSizeComponent';
import { TILE_SIZE } from '../../CONST';

export const atlas = new Atlas(imageAtlas, dataAtlas);

atlas.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class EnemyEntity extends createEntity((maxHP = 1) => [
    new VisualSizeComponent(TILE_SIZE, TILE_SIZE),
    new PositionComponent(),
    new DirectionComponent(),
    new VelocityComponent(),
    new MeshComponent({
        geometry: new PlaneGeometry(atlas.w * 2.2, atlas.h * 2.2),
        material: new MeshLambertMaterial({
            transparent: true,
            alphaTest: 0.5,
        }),
    }),
    new AtlasAnimationComponent({
        atlas,
        time: 0,
        duration: 100,
    }),
    new HealComponent(maxHP),
    new HealBarMeshComponent(),
]) {}

export function isEnemyEntity<T = EnemyEntity>(
    entity: EnemyEntity | unknown,
): entity is EnemyEntity {
    return entity instanceof EnemyEntity;
}
