import { MeshLambertMaterial, NearestFilter, PlaneGeometry } from 'three';

import dataAtlas from '../../../assets/atlases/skeleton_all.json';
import imageAtlas from '../../../assets/atlases/skeleton_all.png';
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

export const atlas = new Atlas(imageAtlas, dataAtlas);

atlas.list.forEach((frame) => {
    frame.texture.magFilter = NearestFilter;
});

export const EnemyEntityID = 'ENEMY_ENTITY' as const;
export type EnemyEntity = ReturnType<typeof createEnemyEntity>;
export const createEnemyEntity = (maxHP = 1) => {
    return createEntity(EnemyEntityID, [
        createVisualSizeComponent(newSize(TILE_SIZE)),
        createPositionComponent(),
        createDirectionComponent(),
        createVelocityComponent(),
        createMeshComponent({
            geometry: new PlaneGeometry(atlas.w * 2.2, atlas.h * 2.2),
            material: new MeshLambertMaterial({
                transparent: true,
                alphaTest: 0.5,
            }),
        }),
        createAtlasAnimationComponent({
            atlas,
            time: 0,
            duration: 100,
        }),
        createHealComponent(maxHP),
        createHealBarMeshComponent(),
    ]);
};
