export type Assign<A, B> = Omit<A, keyof B> & B;

export type Opaque<Type, BaseType> = BaseType & {
    readonly __type__: Type;
    readonly __baseType__: BaseType;
};
