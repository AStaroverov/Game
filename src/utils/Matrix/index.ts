export type MatrixSeed<T> = (x: number, y: number) => T;
export class Matrix<T> {
    buffer: T[];

    constructor(
        public w: number,
        public h: number,
        public seed: MatrixSeed<T>,
    ) {
        this.buffer = new Array(w * h).fill(null);
        this.fill((_, x, y) => seed(x, y));
    }

    forEach(each: (item: T, x: number, y: number, i: number) => void): this {
        this.buffer.forEach((_, i) => {
            const x = i % this.w;
            const y = (i / this.w) | 0;

            each(this.get(x, y)!, x, y, i);
        });

        return this;
    }

    fill(filler: (item: T, x: number, y: number) => T): this {
        this.forEach((item, x, y) => {
            this.set(x, y, filler(item, x, y));
        });

        return this;
    }

    map(mapper: (item: T, x: number, y: number) => T): Matrix<T> {
        const m = new Matrix<T>(this.w, this.h, this.seed);

        m.forEach((_, x, y) => {
            m.set(x, y, mapper(this.get(x, y), x, y));
        });

        return m;
    }

    get(x: number, y: number): T {
        return this.buffer[x + y * this.w];
    }

    set(x: number, y: number, item: T): this {
        this.buffer[x + y * this.w] = item;
        return this;
    }

    toArray(): T[] {
        return this.buffer;
    }

    toNestedArray(): T[][] {
        const m = new Array(this.h)
            .fill(null)
            .map(() => new Array(this.w).fill(null));

        this.forEach((v, x, y) => {
            m[x][y] = v;
        });

        return m;
    }

    setSource(buffer: T[]): void {
        this.buffer = buffer;
    }
}
