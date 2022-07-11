import { useCallback, useState } from 'react';

export function useSelectable<T>(items: T[]) {
    const [selected, setSelected] = useState<T[]>(items);
    const resetSelected = useCallback(() => setSelected(items), []);
    const toggleSelect = useCallback(
        (key: T) =>
            setSelected((selected) => {
                const index = selected.indexOf(key);
                return index === -1
                    ? [...selected, key]
                    : (selected.splice(index, 1), selected.slice());
            }),
        [],
    );

    return { selected, resetSelected, toggleSelect };
}
