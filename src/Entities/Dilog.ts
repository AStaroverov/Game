import { Container, Graphics, Text } from 'pixi.js';

import { TDialogueMessageNode } from '../../assets/dialogue/dialogue';
import { ExtractStruct } from '../../lib/ECS/Component';
import { createEntity, getComponentStruct } from '../../lib/ECS/Entity';
import { createDialogComponent, DialogComponent } from '../Components/Dialogs/Dialog';
import { createDialogConstantsComponent } from '../Components/Dialogs/DialogConstants';
import { ELang } from '../Components/Lang';
import {
    createMeshComponent,
    MeshComponent,
    MeshComponentID,
} from '../Components/Renders/MeshComponent';
import { $ref } from '../CONST';
import { StageName } from '../Renderer';

type DialogGroup = Container & {
    textContainer: Container;
};

export const DialogEntityID = 'DIALOG_ENTITY' as const;
export type DialogEntity = ReturnType<typeof createDialogEntity>;
export const createDialogEntity = (props: ExtractStruct<DialogComponent>) => {
    return createEntity(DialogEntityID, [
        createDialogComponent(props),
        createDialogConstantsComponent(),
        createMeshComponent<DialogGroup>({ layer: StageName.Fixed }),
    ]);
};

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = 10;
export const TEXT_MAX_WIDTH = WIDTH - 2 * PADDING;

export function initRenderDialog(struct: ExtractStruct<MeshComponent>): void {
    const group = new Container() as DialogGroup;
    const background = (() => {
        const g = new Graphics();

        g.beginFill(0x0, 0.7);
        g.drawRect(0, 0, 3000, HEIGHT);
        g.endFill();

        return g;
    })();
    const textContainer = (() => {
        const g = new Container();

        g.position.x = window.innerWidth / 2 - WIDTH / 2 + PADDING;
        g.position.y = PADDING;

        return g;
    })();

    group.textContainer = textContainer;
    group.position.y = window.innerHeight - HEIGHT + PADDING;

    group.addChild(background, textContainer);
    struct[$ref] = group;
}

export function renderDialogNode(
    entity: DialogEntity,
    speakers: string[],
    node: TDialogueMessageNode,
    lang: ELang,
): void {
    const struct = getComponentStruct(entity, MeshComponentID);
    const textContainer = struct[$ref]?.textContainer;

    if (textContainer === undefined) return;

    const text = `${speakers[node.character[1]]}:\n` + node.text?.[lang];
    const textTexture = new Text(text, {
        fontSize: 18,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: TEXT_MAX_WIDTH,
    });
    const choices = node.choices?.map((c, i) => `${i + 1}: ${c.text[lang]}`).join('\n') ?? '';
    const choicesTexture = new Text(choices, {
        fontSize: 18,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: TEXT_MAX_WIDTH,
    });

    choicesTexture.y = textTexture.height;

    textContainer.removeChildren();
    textContainer.addChild(textTexture, choicesTexture);
}
