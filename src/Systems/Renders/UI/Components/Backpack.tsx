import * as Tabs from '@radix-ui/react-tabs';
import cxs from 'cxs';
import React, { MouseEvent, ReactElement } from 'react';

import { useSelectable } from '../../../../../lib/UI/hooks/useSelectable';
import { getResourceName, renameWorldResource } from '../../../../Components/WorldResources';
import { isRenameableResource } from '../../../../Components/WorldResources/utils';
import { getPlayerBackpack } from '../../../../Entities/Player';
import { getCraftResources } from '../../../../Entities/World';
import { useFunction } from '../../../../utils/React/hook/useFunction';
import { useMutableMemo } from '../../../../utils/React/hook/useMutableMemo';
import { TCraftResourceID } from '../../../Craft/resources';
import { useGameHeap } from '../Context/useGameHeap';
import { BackpackItem } from './BackpackItem';
import { Craft } from './Craft';

const cns = {
    backpack: cxs({
        position: 'absolute',
        zIndex: '1',
        top: '10%',
        right: '10%',
        bottom: '10%',
        width: '400px',
        background: 'white',
        opacity: 0.8,
    }),
};

export function Backpack(): ReactElement {
    const gameHeap = useGameHeap();
    const backpack = getPlayerBackpack(gameHeap);
    const resources = getCraftResources(gameHeap);
    const items = useMutableMemo(
        () =>
            (Object.entries(backpack.resourcesCount) as [TCraftResourceID, number][])
                .filter(([_, count]) => count > 0)
                .map(([id, count]) => ({
                    id,
                    count,
                    name: getResourceName(resources, id),
                    isRenameable: isRenameableResource(id),
                })),
        [backpack.resourcesCount, resources.resourcesMap],
    );
    const { selected, toggleSelect, resetSelected } = useSelectable([] as TCraftResourceID[]);
    const handleItemClick = useFunction((id: TCraftResourceID, event: MouseEvent) => {
        if (!event.shiftKey) resetSelected();
        toggleSelect(id);
    });
    const handleItemRename = useFunction((id: TCraftResourceID, name: string) => {
        renameWorldResource(resources, id, name);
    });

    return (
        <Tabs.Root className={cns.backpack} defaultValue="Resources">
            <Tabs.List>
                <Tabs.Trigger value="Resources">Resources</Tabs.Trigger>
                <Tabs.Trigger value="Instruments">Instruments</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="Resources">
                <Craft resourceIds={selected} />
                <BackpackItems
                    items={items}
                    selected={selected}
                    onItemClick={handleItemClick}
                    onItemRename={handleItemRename}
                />
            </Tabs.Content>
            <Tabs.Content value="Instruments">Instruments</Tabs.Content>
        </Tabs.Root>
    );
}

function BackpackItems(props: {
    items: { id: TCraftResourceID; name: string; count: number; isRenameable: boolean }[];
    selected: TCraftResourceID[];
    onItemClick: (id: TCraftResourceID, e: MouseEvent) => unknown;
    onItemRename: (id: TCraftResourceID, name: string) => unknown;
}) {
    return (
        <>
            {props.items.map(({ id, name, count, isRenameable }) => {
                return (
                    <BackpackItem
                        key={id}
                        name={name}
                        count={count}
                        isSelected={props.selected.includes(id)}
                        isRenameable={isRenameable}
                        onClick={(event) => props.onItemClick(id, event)}
                        onRename={(name) => props.onItemRename(id, name)}
                    />
                );
            })}
        </>
    );
}
