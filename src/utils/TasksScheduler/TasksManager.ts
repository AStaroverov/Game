import { Opaque } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TCallback = (...args: any[]) => any;
export type TCallbackId = Opaque<'CallbackId', number>;
export type TCallbackMetadata = {
    cb: TCallback;
    ctx: unknown | null;
    args: unknown[];
    delta: number;
    delay: number;
    times: number;
};

function getIndex(): TCallbackId {
    // @ts-ignore
    getIndex.index = (getIndex.index || 0) + 1;
    // @ts-ignore
    return getIndex.index;
}

export class TasksManager {
    protected cbIds: TCallbackId[] = [];
    protected mapIndexToMetadata = new Map<TCallbackId, TCallbackMetadata>();

    protected lastTime: number = performance.now();

    protected destroyer: VoidFunction;

    constructor(ticker: (fn: VoidFunction) => VoidFunction) {
        this.destroyer = ticker(() => this.exec());
    }

    destroy(): void {
        this.destroyer();
    }

    addTask(
        cb: TCallback,
        props: {
            delay?: number;
            times?: number;
            ctx?: unknown;
            args?: unknown[];
        },
    ): VoidFunction {
        const id = getIndex();

        this.cbIds.push(id);
        this.mapIndexToMetadata.set(id, {
            cb,
            ctx: null,
            args: [],
            times: Infinity,
            delay: 0,
            delta: props.delay || 0,
            ...props,
        });

        return this.deleteTask.bind(this, id);
    }

    addInterval(
        cb: TCallback,
        delay: number,
        props?: {
            ctx?: unknown;
            args?: unknown[];
        },
    ): VoidFunction {
        return this.addTask(cb, { ...props, delay, times: Infinity });
    }

    addTimeout(
        cb: TCallback,
        delay: number,
        props?: {
            ctx?: unknown;
            args?: unknown[];
        },
    ): VoidFunction {
        return this.addTask(cb, { ...props, delay, times: 1 });
    }

    protected deleteTask(id: TCallbackId): void {
        if (this.mapIndexToMetadata.delete(id)) {
            this.cbIds[this.cbIds.indexOf(id)] = NaN as TCallbackId;
        }
    }

    protected exec(): void {
        const now = performance.now();
        const delta = now - this.lastTime;

        this.cbIds.forEach((id) => this.tryExecById(id, delta));
        this.tryClearDeletedCbIds();

        this.lastTime = now;
    }

    protected tryClearDeletedCbIds(): void {
        if (this.cbIds.length !== this.mapIndexToMetadata.size) {
            this.cbIds = this.cbIds.filter((id) => !isNaN(id));
        }
    }

    protected tryExecById(id: TCallbackId, delta: number): void {
        const meta = this.mapIndexToMetadata.get(id);

        if (meta !== undefined) {
            meta.delta -= delta;

            if (meta.delta <= 0) {
                meta.times -= 1;
                meta.cb.call(meta.ctx, ...meta.args);

                if (meta.times > 0) {
                    meta.delta = meta.delay;
                } else {
                    this.deleteTask(id);
                }
            }
        }
    }
}
