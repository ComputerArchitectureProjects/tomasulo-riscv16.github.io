import Memory from './memory';
import RegisterFile from './registers';

class InstructionHandler {
    constructor(input: string, startingaddress: number, numOfStations: number[]) {
        this.instructions = input.split('\n');
        //this.startingaddress = startingaddress;
        this.memory = new Memory();
        this.registerFile = new RegisterFile();
        this.loadStations = (numOfStations[0] > 0) ? numOfStations[0] : 2;
        this.storeStations = (numOfStations[1] > 0) ? numOfStations[1] : 2;
        this.BNEStations = (numOfStations[2] > 0) ? numOfStations[2] : 1;
        this.callRetStations = (numOfStations[3] > 0) ? numOfStations[3] : 1;
        this.addAddiStations = (numOfStations[4] > 0) ? numOfStations[4] : 3;
        this.divStations = (numOfStations[5] > 0) ? numOfStations[5] : 1;
        this.nandStations = (numOfStations[6] > 0) ? numOfStations[6] : 1;
    }

    private memory: Memory;
    private registerFile: RegisterFile;
    private instructions: string[];
    private startingaddress: number = 0;
    private loadStations: number = 2;
    private storeStations: number = 2;
    private BNEStations: number = 1;
    private callRetStations: number = 1;
    private addAddiStations: number = 3;
    private divStations: number = 1;
    private nandStations: number = 1;
    private issueTime: number[];
    private startExecutionTime: number[];
    private endExecutionTime: number[];
    private writeTime: number[];
    private issueCounter: number = 0;
    private curClockCycle: number = 1;

    public executeInstructions(instruction: string[]): void {
        const opcode = instruction[0];
        for (; this.issueCounter < instruction.length; this.curClockCycle++) {
            switch (opcode) {
                case "LOAD":
                    if (this.LoadStations > 0) {
                        //        this.issueTime[this.issueCounter] = this.curClockCycle;
                        //        this.availableLoadStations--;
                        //        this.issueCounter++;
                    }
                    break;
                case "STORE":
                    break;
                case "BNE":
                    break;
                case "CALL":
                    break;
                case "RET":
                    break;
                case "ADD":
                    break;
                case "ADDI":
                    break;
                case "NAND":
                    break;
                case "DIV":
                    break;
                default:
                    throw new Error("Invalid opcode");
            }

        }
    }
}

export default InstructionHandler;