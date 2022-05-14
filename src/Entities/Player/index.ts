import { MeshLambertMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlasPlayer from '../../../assets/atlases/player_idle.json';
import imageAtlasPlayer from '../../../assets/atlases/player_idle.png';
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

export const atlasPlayer = new Atlas(imageAtlasPlayer, dataAtlasPlayer);

atlasPlayer.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class PlayerEntity extends createEntity(() => [
    new VisualSizeConstructor(TILE_SIZE, TILE_SIZE),
    new PositionConstructor(),
    new DirectionComponent(),
    new VelocityConstructor(),
    new MeshComponent({
        geometry: new PlaneGeometry(atlasPlayer.w * 3, atlasPlayer.h * 3),
        material: new MeshLambertMaterial({
            transparent: true,
            alphaTest: 0.5,
        }),
    }),
    new AtlasAnimationConstructor({
        time: 0,
        duration: 100,
        atlas: atlasPlayer,
    }),
    new HealConstructor(100),
    new HealBarMeshComponent(),
]) {}

export function isPlayerEntity<T = PlayerEntity>(
    entity: PlayerEntity | unknown,
): entity is PlayerEntity {
    return entity instanceof PlayerEntity;
}
