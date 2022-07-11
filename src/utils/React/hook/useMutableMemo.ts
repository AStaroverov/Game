import { useEffect, useRef, useState } from 'react';

import hash_sum = require('hash-sum');
import { tasksScheduler } from '../../TasksScheduler/TasksScheduler';

export function useMutableMemo<T, V>(fn: () => T, refs: V[]): T {
    const [state, set] = useState<T>(fn());
    const hash = useRef<string>('');

    useEffect(
        () =>
            tasksScheduler.addFrameInterval(() => {
                const nextHash = hash_sum(refs);

                if (nextHash !== hash.current) {
                    hash.current = nextHash;
                    set(fn());
                }
            }, 8),
        [],
    );

    return state;
}
