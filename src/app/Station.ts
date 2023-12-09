type Pair = {
    station: string, index: number
}

class Station {
    constructor() {
        this.busy = false;
        this.op = "";
        this.vj = -1;
        this.vk = -1;
        this.qj = {station: "", index: -1};
        this.qk = {station: "", index: -1};
        this.a = -1;
        this.name = "";
    }

    private name: string;
    private busy: boolean;
    private op: string;
    private vj: number;
    private vk: number;
    private qj: Pair;
    private qk: Pair;
    private a: number;

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getBusy(): boolean {
        return this.busy;
    }

    public setBusy(busy: boolean): void {
        this.busy = busy;
    }

    public getOp(): string {
        return this.op;
    }

    public setOp(op: string): void {
        this.op = op;
    }

    public getVj(): number {
        return this.vj;
    }

    public setVj(vj: number): void {
        this.vj = vj;
    }

    public getVk(): number {
        return this.vk;
    }

    public setVk(vk: number): void {
        this.vk = vk;
    }

    public getQj(): Pair {
        return this.qj;
    }

    public setQj(qj: Pair): void {
        this.qj = qj;
    }

    public getQk(): Pair {
        return this.qk;
    }

    public setQk(qk: Pair): void {
        this.qk = qk;
    }

    public getA(): number {
        return this.a;
    }

    public setA(a: number): void {
        this.a = a;
    }

    public reset(): void {
        this.busy = false;
        this.op = "";
        this.vj = -1;
        this.vk = -1;
        this.qj = {station: "", index: -1};
        this.qk = {station: "", index: -1};
        this.a  = -1;
    }
}   

export default Station;