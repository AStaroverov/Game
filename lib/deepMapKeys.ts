import { isPlainObject, mapKeys, mapValues } from 'lodash';

export const deepMapKeys =
    (cb: (key: string) => string) =>
    <R extends object | unknown[]>(obj: Record<string, unknown> | Array<unknown> | unknown): R => {
        if (Array.isArray(obj)) {
            return obj.map((item) => deepMapKeys(cb)(item)) as R;
        }

        if (isPlainObject(obj)) {
            return mapValues(
                mapKeys(obj as object, (_, key) => cb(key)),
                (value) => deepMapKeys(cb)(value),
            ) as R;
        }

        return obj as R;
    };
