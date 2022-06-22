export function range<T>(
    length: number,
    seed: (i: number) => T = (i: number) => i as unknown as T,
): T[] {
    return new Array(length).fill(undefined).map((_, i) => seed(i));
}
