import { MeshLambertMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlasPlayer from '../../../assets/atlases/player_idle.json';
import imageAtlasPlayer from '../../../assets/atlases/player_idle.png';
import { Atlas } from '../../../lib/Atlas';
import { createEntity } from '../../../lib/ECS/Entity';
import { createAtlasAnimationComponent } from '../../Components/AtlasAnimation';
import { createDirectionComponent } from '../../Components/DirectionComponent';
import { createHealComponent } from '../../Components/Heal';
import { createPositionComponent } from '../../Components/Position';
import { createHealBarMeshComponent } from '../../Components/Renders/HealBarMeshComponent';
import { createMeshComponent } from '../../Components/Renders/MeshComponent';
import { createVelocityComponent } from '../../Components/Velocity';
import { createVisualSizeComponent } from '../../Components/VisualSize';
import { TILE_SIZE } from '../../CONST';
import { newSize } from '../../utils/shape';

export const atlasPlayer = new Atlas(imageAtlasPlayer, dataAtlasPlayer);

atlasPlayer.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export const PlayerEntityID = 'PLAYER_ENTITY' as const;
export type PlayerEntity = ReturnType<typeof createPlayerEntity>;
export const createPlayerEntity = () =>
    createEntity(PlayerEntityID, [
        createVisualSizeComponent(newSize(TILE_SIZE)),
        createPositionComponent(),
        createDirectionComponent(),
        createVelocityComponent(),
        createMeshComponent({
            geometry: new PlaneGeometry(atlasPlayer.w * 3, atlasPlayer.h * 3),
            material: new MeshLambertMaterial({
                transparent: true,
                alphaTest: 0.5,
            }),
        }),
        createAtlasAnimationComponent({
            time: 0,
            duration: 100,
            atlas: atlasPlayer,
        }),
        createHealComponent(100),
        createHealBarMeshComponent(),
    ]);
