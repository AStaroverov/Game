import { Opaque } from '../../types';

export enum CallbackType {
    frame = 'frame',
    time = 'time',
}
export type Callback = (delta: number) => unknown;
export type CallbackId = Opaque<'CallbackId', number>;
export type CallbackMetadata = {
    cb: Callback;
    ctx: unknown | null;

    type: CallbackType;
    delta: number;

    delay: number;
    times: number;
};

function getIndex(): CallbackId {
    // @ts-ignore
    getIndex.index = (getIndex.index || 0) + 1;
    // @ts-ignore
    return getIndex.index;
}

export class TasksManager {
    protected cbIds: CallbackId[] = [];
    protected mapIndexToMetadata = new Map<CallbackId, CallbackMetadata>();

    protected lastTime: number = performance.now();

    protected destroyer: VoidFunction;

    constructor(ticker: (fn: VoidFunction) => VoidFunction) {
        this.destroyer = ticker((delta?: number) => this.exec(delta));
    }

    destroy(): void {
        this.destroyer();
    }

    addTask(
        cb: Callback,
        props: {
            type?: CallbackType;
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
            type: CallbackType.time,
            times: Infinity,
            delay: 0,

            delta: props.delay || 0,

            ...props,
        });

        return this.deleteTask.bind(this, id);
    }

    protected deleteTask(id: CallbackId): void {
        if (this.mapIndexToMetadata.delete(id)) {
            this.cbIds[this.cbIds.indexOf(id)] = NaN as CallbackId;
        }
    }

    protected exec(delta?: number): void {
        if (delta === undefined) {
            const now = performance.now();
            delta = now - this.lastTime;
            this.lastTime = now;
        }

        this.cbIds.forEach((id) => this.tryExecById(id, delta!));
        this.tryClearDeletedCbIds();
    }

    protected tryClearDeletedCbIds(): void {
        if (this.cbIds.length !== this.mapIndexToMetadata.size) {
            this.cbIds = this.cbIds.filter((id) => !isNaN(id));
        }
    }

    protected tryExecById(id: CallbackId, timeDelta: number): void {
        const meta = this.mapIndexToMetadata.get(id);

        if (meta !== undefined) {
            meta.delta -= timeDelta;

            if (meta.delta <= 0) {
                meta.times -= 1;
                meta.cb.call(meta.ctx, meta.delay - meta.delta);

                if (meta.times > 0) {
                    meta.delta = meta.delay;
                } else {
                    this.deleteTask(id);
                }
            }
        }
    }
}
