import clsx from 'clsx';
import cxs from 'cxs';
import React, { KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { useToggle } from 'react-use';

import { useFunction } from '../../../../utils/React/hook/useFunction';

const cns = {
    listItem: cxs({
        cursor: 'pointer',
        padding: '8px',
    }),
    selectedListItem: cxs({
        background: 'red',
    }),
    item: cxs({
        display: 'flex',
    }),
    itemContent: cxs({
        flexGrow: 1,
    }),
};

export function BackpackItem(props: {
    name: string;
    count: number;
    isSelected: boolean;
    isRenameable: boolean;
    onClick: (e: MouseEvent, name: string) => unknown;
    onRename: (name: string) => unknown;
}) {
    const [renaming, toggleRenaming] = useToggle(false);
    const cn = clsx(cns.listItem, {
        [cns.selectedListItem]: props.isSelected,
    });
    const handleStopProp = useFunction(<E extends SyntheticEvent>(event: E) => {
        event.stopPropagation();
    });
    const startRename = useFunction((event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        toggleRenaming();
    });
    const handleRename = useFunction((event: KeyboardEvent<HTMLInputElement>) => {
        handleStopProp(event);

        if (event.code === 'Enter') {
            props.onRename?.(event.currentTarget.value);
            toggleRenaming();
        }
        if (event.code === 'Escape') {
            toggleRenaming();
        }
    });

    return (
        <div className={cn} onClick={(event) => props.onClick(event, props.name)}>
            <div className={cns.item}>
                <div className={cns.itemContent}>
                    {renaming && (
                        <input autoFocus onClick={handleStopProp} onKeyUpCapture={handleRename} />
                    )}
                    {!renaming && `${props.name}: ${props.count}`}
                </div>
                {props.isRenameable && (
                    <button onClick={startRename}>
                        <AiFillEdit />
                    </button>
                )}
            </div>
        </div>
    );
}
