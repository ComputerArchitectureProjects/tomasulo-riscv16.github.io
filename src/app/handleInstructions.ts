import Memory from './memory';
import RegisterFile from './registers';

class InstructionHandler {
    constructor(input: string) {
        this.instructions = input.split('\n');
        alert(this.instructions[5]);
        alert("first")
    }
    private Memory = new Memory();
    private RegisterFile = new RegisterFile();    
    private instructions: string[];

    public executeInstruction(instruction: string[]): void {
        const opcode = instruction[0];
    }

    public writeMemory(address: number, value: number): void {
        if (address < 0 || address > 65535) {
            throw new Error("Invalid memory address");
        }
    }

    public readMemory(address: number): number {
        if (address < 0 || address > 65535) {
            throw new Error("Invalid memory address");
        }
    }
}
  
export default InstructionHandler;