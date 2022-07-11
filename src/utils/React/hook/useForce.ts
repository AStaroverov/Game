import { useMemo, useState } from 'react';

export function useForce(): VoidFunction {
    const s = useState(true);
    return useMemo(() => () => s[1]((v) => !v), []);
}
