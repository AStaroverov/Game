export class VelocityComponent {
    constructor(public v: number = 0) {}
}

export function setVelocity(component: VelocityComponent, v: number): void {
    component.v = v;
}
