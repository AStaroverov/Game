import {
    ENodeType,
    TDialogueNode,
    TDialogueNodes,
    TDialogueStartNode,
    TNodeName,
} from '../../assets/dialogue/dialogue';

export function* iterateDialog(
    nodes: TDialogueNodes,
): Generator<TDialogueNode, undefined, undefined | TNodeName> {
    const startNode = nodes.find((n) => n.nodeType === ENodeType.Start) as TDialogueStartNode;
    let next: undefined | TNodeName;
    let node: undefined | TDialogueNode = nodes.find(
        (n): n is TDialogueNode => n.nodeName === startNode.next,
    )!;

    while (node !== undefined) {
        next = yield getItem(node);
        node =
            next === undefined
                ? undefined
                : nodes.find((n): n is TDialogueNode => n.nodeName === next);
    }

    function getItem(node: TDialogueNode) {
        return node;
    }

    return undefined;
}
