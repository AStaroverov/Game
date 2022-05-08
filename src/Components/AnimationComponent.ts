export type AnimationProps = { duration?: number; time?: number };

export class AnimationComponent {
    time = 0;
    duration = 0;
    constructor(props: AnimationProps) {
        this.time = props.time ?? 0;
        this.duration = props.duration ?? 0;
    }
}
