import { Opaque } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TCallback = (delta: number) => any;
export type TCallbackId = Opaque<'CallbackId', number>;
export type TCallbackMetadata = {
    cb: TCallback;
    ctx: unknown | null;
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
        this.destroyer = ticker((delta?: number) => this.exec(delta));
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
        },
    ): VoidFunction {
        const id = getIndex();

        this.cbIds.push(id);
        this.mapIndexToMetadata.set(id, {
            cb,
            ctx: null,
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
        ctx: unknown = null,
    ): VoidFunction {
        return this.addTask(cb, { ctx, delay, times: Infinity });
    }

    addTimeout(
        cb: TCallback,
        delay: number,
        ctx: unknown = null,
    ): VoidFunction {
        return this.addTask(cb, { ctx, delay, times: 1 });
    }

    protected deleteTask(id: TCallbackId): void {
        if (this.mapIndexToMetadata.delete(id)) {
            this.cbIds[this.cbIds.indexOf(id)] = NaN as TCallbackId;
        }
    }

    protected exec(delta?: number): void {
        if (delta === undefined) {
            const now = performance.now();
            delta = now - this.lastTime;
            this.lastTime = now;
        }

        this.cbIds.forEach((id) => this.tryExecById(id, delta!, delta!));
        this.tryClearDeletedCbIds();
    }

    protected tryClearDeletedCbIds(): void {
        if (this.cbIds.length !== this.mapIndexToMetadata.size) {
            this.cbIds = this.cbIds.filter((id) => !isNaN(id));
        }
    }

    protected tryExecById(
        id: TCallbackId,
        metaDelta: number,
        timeDelta: number,
    ): void {
        const meta = this.mapIndexToMetadata.get(id);

        if (meta !== undefined) {
            meta.delta -= metaDelta;

            if (meta.delta <= 0) {
                meta.times -= 1;
                meta.cb.call(meta.ctx, timeDelta);

                if (meta.times > 0) {
                    meta.delta = meta.delay;
                } else {
                    this.deleteTask(id);
                }
            }
        }
    }
}
