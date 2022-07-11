import * as Tabs from '@radix-ui/react-tabs';
import clsx from 'clsx';
import cxs from 'cxs';
import React, { MouseEvent, ReactElement } from 'react';

import { useSelectable } from '../../../../../lib/UI/hooks/useSelectable';
import { getPlayerBackpack } from '../../../../Entities/Player';
import { useFunction } from '../../../../utils/React/hook/useFunction';
import { useMutableMemo } from '../../../../utils/React/hook/useMutableMemo';
import { useGameHeap } from '../Context/useGameHeap';
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
    listItem: cxs({
        cursor: 'pointer',
        padding: '8px',
    }),
    selectedListItem: cxs({
        background: 'red',
    }),
};

export function Backpack(): ReactElement {
    const gameHeap = useGameHeap();
    const backpack = getPlayerBackpack(gameHeap);
    const resourcesCount = useMutableMemo(
        () =>
            Object.entries(backpack.resourcesCount)
                .filter(([_, count]) => count > 0)
                .map(([name, count]) => ({ name, count })),
        [backpack.resourcesCount],
    );
    const { selected, toggleSelect, resetSelected } = useSelectable([] as string[]);
    const handleClickItem = useFunction((event: MouseEvent, name: string) => {
        if (!event.shiftKey) resetSelected();
        toggleSelect(name);
    });

    return (
        <Tabs.Root className={cns.backpack} defaultValue="Resources">
            <Tabs.List>
                <Tabs.Trigger value="Resources">Resources</Tabs.Trigger>
                <Tabs.Trigger value="Instruments">Instruments</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="Resources">
                <BackpackItems
                    items={resourcesCount}
                    selected={selected}
                    onClickItem={handleClickItem}
                />
                <Craft resourceNames={selected} />
            </Tabs.Content>
            <Tabs.Content value="Instruments">Instruments</Tabs.Content>
        </Tabs.Root>
    );
}

function BackpackItems(props: {
    items: { name: string; count: number }[];
    selected: string[];
    onClickItem: (e: MouseEvent, name: string) => unknown;
}) {
    return (
        <>
            {props.items.map(({ name, count }) => {
                return (
                    <BackpackItem
                        key={name}
                        name={name}
                        count={count}
                        isSelected={props.selected.includes(name)}
                        onClick={(event) => props.onClickItem(event, name)}
                    />
                );
            })}
        </>
    );
}

function BackpackItem(props: {
    name: string;
    count: number;
    isSelected: boolean;
    onClick: (e: MouseEvent, name: string) => unknown;
}) {
    const cn = clsx(cns.listItem, {
        [cns.selectedListItem]: props.isSelected,
    });

    return (
        <div className={cn} onClick={(event) => props.onClick(event, props.name)}>
            {props.name}: {props.count}
        </div>
    );
}
