import { Container, Text } from 'pixi.js';

import { ExtractStruct } from '../../lib/ECS/Component';
import { createEntity, getComponentStruct } from '../../lib/ECS/Entity';
import { DialogID } from '../Components/Dialogs/data';
import { createDialogComponent } from '../Components/Dialogs/Dialog';
import {
    createMeshComponent,
    MeshComponent,
    MeshComponentID,
} from '../Components/Renders/MeshComponent';
import { $ref } from '../CONST';
import { StageName } from '../Renderer';

type DialogGroup = Container & {
    groupText: Container;
};

export const DialogEntityID = 'DIALOG_ENTITY' as const;
export type DialogEntity = ReturnType<typeof createDialogEntity>;
export const createDialogEntity = (props: { id: DialogID }) => {
    return createEntity(DialogEntityID, [
        createDialogComponent(props),
        createMeshComponent<DialogGroup>({ layer: StageName.Fixed }),
    ]);
};

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = 10;
export const TEXT_MAX_WIDTH = WIDTH - 2 * PADDING;

export function initDialogEntityMesh(struct: ExtractStruct<MeshComponent>): void {
    const group = new Container();
    // const groupText = new Group();
    // const background = new Mesh(
    //     new PlaneGeometry(WIDTH, HEIGHT),
    //     new MeshLambertMaterial({
    //         color: 0x0,
    //         opacity: 0.7,
    //         transparent: true,
    //     }),
    // );
    //
    // group.position.x = 0;
    // group.position.y = HEIGHT - window.innerHeight / 2;
    // group.position.z = 1;
    //
    // groupText.position.x = -WIDTH / 2 + PADDING;
    // groupText.position.y = HEIGHT / 2 - PADDING;
    // groupText.position.z = 2;
    //
    // group.groupText = groupText;
    // group.add(background, groupText);

    // struct[$ref] = group;
}

export function setDialogText(entity: DialogEntity, text: string): void {
    const struct = getComponentStruct(entity, MeshComponentID);
    const groupText = struct[$ref]?.groupText;

    if (groupText === undefined) return;

    const object = new Text(text, {
        fontSize: 18,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: TEXT_MAX_WIDTH,
    });

    groupText.removeChildren();
    groupText.addChild(object);
}
