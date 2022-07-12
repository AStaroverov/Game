import React, { ReactElement, useMemo } from 'react';

import { useFunction } from '../../../../utils/React/hook/useFunction';
import { craftResource, getCraftActions } from '../../../Craft';
import { ECraftAction } from '../../../Craft/actions';
import { useGameHeap } from '../Context/useGameHeap';

export type TCraftProps = {
    resourceNames: string[];
    onCraft?: VoidFunction;
};

export function Craft(props: TCraftProps): ReactElement {
    const gameHeap = useGameHeap();
    const actions = useMemo(
        () => getCraftActions(gameHeap, props.resourceNames),
        [props.resourceNames],
    );
    const craft = useFunction((action: ECraftAction) => {
        craftResource(gameHeap, props.resourceNames, action);
        props.onCraft?.();
    });

    return (
        <div>
            {actions.map((action) => {
                return (
                    <button key={action} onClick={() => craft(action)}>
                        {action}
                    </button>
                );
            })}
        </div>
    );
}
