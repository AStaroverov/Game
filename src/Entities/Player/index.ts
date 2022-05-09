import { MeshBasicMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlasPlayer from '../../../assets/atlases/player_idle.json';
import imageAtlasPlayer from '../../../assets/atlases/player_idle.png';
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

export const atlasPlayer = new Atlas(imageAtlasPlayer, dataAtlasPlayer);

atlasPlayer.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export class PlayerEntity extends createEntity(() => [
    new VisualSizeComponent(TILE_SIZE, TILE_SIZE),
    new PositionComponent(),
    new DirectionComponent(),
    new VelocityComponent(),
    new MeshComponent({
        geometry: new PlaneGeometry(atlasPlayer.w * 3, atlasPlayer.h * 3),
        material: new MeshBasicMaterial({ transparent: true, alphaTest: 0.5 }),
    }),
    new AtlasAnimationComponent({
        time: 0,
        duration: 100,
        atlas: atlasPlayer,
    }),
    new HealComponent(100),
    new HealBarMeshComponent(),
]) {}

export function isPlayerEntity<T = PlayerEntity>(
    entity: PlayerEntity | unknown,
): entity is PlayerEntity {
    return entity instanceof PlayerEntity;
}
