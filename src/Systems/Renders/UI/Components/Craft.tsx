import React, { ReactElement, useMemo } from 'react';

import { useFunction } from '../../../../utils/React/hook/useFunction';
import { useKeyUp } from '../../../../utils/React/hook/useKey';
import { craftResource, getCraftActions } from '../../../Craft';
import { ECraftAction } from '../../../Craft/actions';
import { TCraftResourceID } from '../../../Craft/resources';
import { useGameHeap } from '../Context/useGameHeap';

export type TCraftProps = {
    resourceIds: TCraftResourceID[];
    onCraft?: VoidFunction;
};

const mapActionToKey = {
    [ECraftAction.Dry]: '1',
    [ECraftAction.Grind]: '2',
    [ECraftAction.Squeeze]: '3',
    [ECraftAction.Mix]: '4',
};
const allAction = [ECraftAction.Dry, ECraftAction.Grind, ECraftAction.Squeeze, ECraftAction.Mix];

export function Craft(props: TCraftProps): ReactElement {
    const gameHeap = useGameHeap();
    const activeActions = useMemo(
        () => getCraftActions(gameHeap, props.resourceIds),
        [props.resourceIds],
    );
    const craft = useFunction((action: ECraftAction) => {
        craftResource(gameHeap, props.resourceIds, action);
        props.onCraft?.();
    });

    allAction.forEach((action) => {
        useKeyUp(mapActionToKey[action], () => activeActions.includes(action) && craft(action));
    });

    return (
        <div>
            {allAction.map((action) => {
                return (
                    <button
                        key={action}
                        onClick={() => craft(action)}
                        disabled={!activeActions.includes(action)}
                    >
                        ({mapActionToKey[action]}){action}
                    </button>
                );
            })}
        </div>
    );
}
