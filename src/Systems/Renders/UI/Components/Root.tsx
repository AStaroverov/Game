import React, { ReactNode } from 'react';

import { GameHeap } from '../../../../heap';
import { ProviderGameHeap } from '../Context/useGameHeap';

export function Root(props: { gameHeap: GameHeap; children: ReactNode }) {
    return <ProviderGameHeap value={props.gameHeap}>{props.children}</ProviderGameHeap>;
}
