import { Group, Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';
// @ts-ignore
import { Text } from 'troika-three-text';

import { ExtractStruct } from '../../lib/ECS/Component';
import { createEntity, getComponentStruct } from '../../lib/ECS/Entity';
import { DialogID } from '../Components/Dialogs/data';
import { createDialogComponent } from '../Components/Dialogs/Dialog';
import {
    createMeshComponent,
    MeshComponent,
    MeshComponentID,
} from '../Components/Renders/MeshComponent';
import { $object } from '../CONST';
import { Layer } from '../Renderer';

type DialogGroup = Group & {
    groupText: Group;
};

export const DialogEntityID = 'DIALOG_ENTITY' as const;
export type DialogEntity = ReturnType<typeof createDialogEntity>;
export const createDialogEntity = (props: { id: DialogID }) => {
    return createEntity(DialogEntityID, [
        createDialogComponent(props),
        createMeshComponent<DialogGroup>(Layer.Fixed),
    ]);
};

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = 10;
export const TEXT_MAX_WIDTH = WIDTH - 2 * PADDING;

export function initDialogEntityMesh(
    struct: ExtractStruct<MeshComponent>,
): void {
    const group = new Group() as DialogGroup;
    const groupText = new Group();
    const background = new Mesh(
        new PlaneGeometry(WIDTH, HEIGHT),
        new MeshLambertMaterial({
            color: 0x0,
            opacity: 0.7,
            transparent: true,
        }),
    );

    group.position.x = 0;
    group.position.y = HEIGHT - window.innerHeight / 2;
    group.position.z = 1;

    groupText.position.x = -WIDTH / 2 + PADDING;
    groupText.position.y = HEIGHT / 2 - PADDING;
    groupText.position.z = 2;

    group.groupText = groupText;
    group.add(background, groupText);

    struct[$object] = group;
}

export function setDialogText(entity: DialogEntity, text: string): void {
    const struct = getComponentStruct(entity, MeshComponentID);
    const groupText = struct[$object]?.groupText;

    if (groupText === undefined) return;

    const object = new Text();

    object.text = text;
    object.fontSize = 18;
    object.color = 0xffffff;
    object.maxWidth = TEXT_MAX_WIDTH;
    object.sync();

    groupText.clear();
    groupText.add(object);
}
