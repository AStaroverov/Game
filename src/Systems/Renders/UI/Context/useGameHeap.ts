import { createContext, useContext } from 'react';

import { GameHeap } from '../../../../heap';

export const ContextGameHeap = createContext<GameHeap>({} as GameHeap);
export const ProviderGameHeap = ContextGameHeap.Provider;
export const useGameHeap = (): GameHeap => useContext(ContextGameHeap);
