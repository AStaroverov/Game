import { useEffect, useRef } from 'react';

import hash_sum = require('hash-sum');
import { tasksScheduler } from '../../TasksScheduler/TasksScheduler';
import { useForce } from './useForce';

export function useMutableData(...refs: object[]): void {
    const force = useForce();
    const hash = useRef<string>('');

    useEffect(() => {
        return tasksScheduler.addFrameInterval(() => {
            const nextHash = hash_sum(refs);

            if (nextHash !== hash.current) {
                hash.current = nextHash;
                force();
            }
        }, 8);
    }, []);
}
