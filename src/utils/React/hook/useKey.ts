import { DependencyList } from 'react';
import { useKey } from 'react-use';
import { UseEventTarget } from 'react-use/lib/useEvent';
import { Handler, KeyFilter, UseKeyOptions } from 'react-use/lib/useKey';

export const useKeyUp: <T extends UseEventTarget>(
    key: KeyFilter,
    fn: Handler,
    opts?: Omit<UseKeyOptions<T>, 'event'>,
    deps?: DependencyList,
) => void = (key, fn, opts, deps) => useKey(key, fn, { ...opts, event: 'keyup' }, deps);

export const useKeyDown: <T extends UseEventTarget>(
    key: KeyFilter,
    fn: Handler,
    opts?: Omit<UseKeyOptions<T>, 'event'>,
    deps?: DependencyList,
) => void = (key, fn, opts, deps) => useKey(key, fn, { ...opts, event: 'keydown' }, deps);
