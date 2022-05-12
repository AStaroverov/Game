import { $tag } from './tag';

export type Component<
    Tag extends string = string,
    Body extends object = object,
> = { [$tag]: Tag } & Body;

export type ComponentConstructor<
    Tag extends string = string,
    Props extends any[] = any[],
    Body extends object = object,
> = {
    (...props: Props): Component<Tag, Body>;
    [$tag]: Tag;
};

export type ExtractComponentTag<CC extends Component> = CC extends Component<
    infer Tag
>
    ? Tag
    : never;

export type ExtractComponentBody<CC extends Component> = CC extends Component<
    string,
    infer Body
>
    ? Body
    : never;

export type ExtractConstructorComponentTag<CC extends ComponentConstructor> =
    CC extends ComponentConstructor<infer Tag> ? Tag : never;

export type ExtractConstructorComponentBody<CC extends ComponentConstructor> =
    CC extends ComponentConstructor<string, any[], infer Body> ? Body : never;

export function createComponentConstructor<
    Tag extends string = string,
    Props extends any[] = any[],
    Body extends object = object,
>(
    tag: Tag,
    get: (...props: Props) => Body,
): ComponentConstructor<Tag, Props, Body> {
    const wrapped = (...props: Props) => {
        return { ...get(...props), [$tag]: tag };
    };

    // @ts-ignore
    wrapped[$tag] = tag;

    return wrapped as ComponentConstructor<Tag, Props, Body>;
}
