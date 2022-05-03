export type Opaque<Type, BaseType> = BaseType & {
    readonly __type__: Type;
    readonly __baseType__: BaseType;
};

export type Entity = unknown;

export interface RenderEntity<P> {
    render(): void;
    update(props: P): void;
}
