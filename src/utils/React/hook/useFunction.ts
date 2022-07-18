import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFunction<T extends (...args: any[]) => any>(handler: T): T {
    const ref = useRef<{ handler: T }>({ handler });

    ref.current.handler = handler;

    return useCallback((...args: Parameters<T>): ReturnType<T> => {
        return ref.current.handler(...args);
    }, []) as T;
}
