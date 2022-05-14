import { MeshLambertMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlas from '../../../assets/atlases/skeleton_all.json';
import imageAtlas from '../../../assets/atlases/skeleton_all.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/entities';
import { AtlasAnimationConstructor } from '../../Components/AtlasAnimation';
import { DirectionComponent } from '../../Components/DirectionComponent';
import { HealConstructor } from '../../Components/Heal';
import { PositionConstructor } from '../../Components/Position';
import { HealBarMeshComponent } from '../../Components/Renders/HealBarMeshComponent';
import { MeshComponent } from '../../Components/Renders/MeshComponent';
import { VelocityConstructor } from '../../Components/Velocity';
import { VisualSizeConstructor } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';

export const atlas = new Atlas(imageAtlas, dataAtlas);

atlas.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class EnemyEntity extends createEntity((maxHP = 1) => [
    new VisualSizeConstructor(TILE_SIZE, TILE_SIZE),
    new PositionConstructor(),
    new DirectionComponent(),
    new VelocityConstructor(),
    new MeshComponent({
        geometry: new PlaneGeometry(atlas.w * 2.2, atlas.h * 2.2),
        material: new MeshLambertMaterial({
            transparent: true,
            alphaTest: 0.5,
        }),
    }),
    new AtlasAnimationConstructor({
        atlas,
        time: 0,
        duration: 100,
    }),
    new HealConstructor(maxHP),
    new HealBarMeshComponent(),
]) {}

export function isEnemyEntity<T = EnemyEntity>(
    entity: EnemyEntity | unknown,
): entity is EnemyEntity {
    return entity instanceof EnemyEntity;
}
