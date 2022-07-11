import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { GameHeap } from '../../../heap';
import { Backpack } from './Components/Backpack';
import { Root } from './Components/Root';

export function BackpackRenderSystem(heap: GameHeap) {
    const rootElement = document.createElement('div');
    const reactRoot = createRoot(rootElement);

    reactRoot.render(
        createElement(Root, {
            gameHeap: heap,
            children: createElement(Backpack),
        }),
    );

    document.body.append(rootElement);

    return () => {
        reactRoot.unmount();
        document.body.removeChild(rootElement);
    };
}
