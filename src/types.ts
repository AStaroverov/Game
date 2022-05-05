import { Mesh } from 'three';

export type Opaque<Type, BaseType> = BaseType & {
    readonly __type__: Type;
    readonly __baseType__: BaseType;
};

export interface RenderEntity<P> {
    mesh: Mesh;
}
