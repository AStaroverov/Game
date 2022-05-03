export class Player {
    x = 0;
    y = 0;

    constructor(props: { x: number; y: number }) {
        this.x = props.x;
        this.y = props.y;
    }

    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }
}
