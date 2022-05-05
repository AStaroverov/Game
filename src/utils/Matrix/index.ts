export class Matrix<T> {
    buffer: T[];

    constructor(
        public n: number,
        public m: number,
        seed: (x: number, y: number) => T,
    ) {
        this.buffer = new Array(n * m).fill(null);
        this.fill((_, x, y) => seed(x, y));
    }

    forEach(each: (item: T, x: number, y: number) => void): this {
        this.buffer.forEach((_, i) => {
            const x = i % this.n;
            const y = (i / this.n) | 0;

            each(this.get(x, y)!, x, y);
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
        return new Matrix<T>(this.n, this.m, (x, y) =>
            mapper(this.get(x, y)!, x, y),
        );
    }

    get(x: number, y: number): T | undefined {
        return this.buffer[x + y * this.n];
    }

    set(x: number, y: number, item: T): this {
        this.buffer[x + y * this.n] = item;
        return this;
    }

    toArray(): T[] {
        return this.buffer;
    }

    setSource(buffer: T[]): void {
        this.buffer = buffer;
    }
}
