export const structuredClone: <T extends object>(obj: T) => T = (obj) =>
    // @ts-ignore
    window.structuredClone(obj);
