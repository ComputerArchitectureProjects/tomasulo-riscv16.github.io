class Memory {
    constructor() {
      this.memory.fill(0);
    }

    private memory: number[] = Array(65536);

    public writeMemory(address: number, value: number): void {
        if (address < 0 || address > 65535) {
            throw new Error("Invalid memory address");
        }
        this.memory[address] = value;
    }

    public readMemory(address: number): number {
        if (address < 0 || address > 65535) {
            throw new Error("Invalid memory address");
        }
        return this.memory[address];
    }
}
  
export default Memory;