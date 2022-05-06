export interface Constructor<T = object> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
    prototype: T;
}
export type Component<C extends object = object> = C;

export type Entity<C extends Component = Component> = {
    components: Map<Constructor<C>, C>;
};
