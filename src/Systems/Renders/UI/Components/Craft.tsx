import React, { ReactElement, useMemo } from 'react';

import { craftResource } from '../../../../Components/Backpack';
import { getPlayerBackpack } from '../../../../Entities/Player';
import { useFunction } from '../../../../utils/React/hook/useFunction';
import { useMutableMemo } from '../../../../utils/React/hook/useMutableMemo';
import { ECraftAction, getResourcesAvailableActions } from '../../../Craft/actions';
import { useGameHeap } from '../Context/useGameHeap';

export type TCraftProps = {
    resourceNames: string[];
    onCraft?: VoidFunction;
};

export function Craft(props: TCraftProps): ReactElement {
    const gameHeap = useGameHeap();
    const backpack = getPlayerBackpack(gameHeap);
    const resourcesMap = useMutableMemo(() => backpack.resourcesMap, [backpack.resourcesMap]);

    const resources = useMemo(
        () => props.resourceNames.map((n) => resourcesMap[n]),
        [props.resourceNames, resourcesMap],
    );
    const actions = useMemo(() => getResourcesAvailableActions(resources), [resources]);
    const craft = useFunction((action: ECraftAction) => {
        craftResource(backpack, resources, action);
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
