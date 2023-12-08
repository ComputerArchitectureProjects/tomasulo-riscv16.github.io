import Memory from './memory';
import RegisterFile from './registers';

class InstructionHandler {
    constructor(input: string, startingaddress: number, numOfStations: number[]) {
        this.instructions = input.split('\n');
        //this.startingaddress = startingaddress;
        this.Memory = new Memory();
        this.RegisterFile = new RegisterFile();
        this.availableLoadStations = (numOfStations[0]>0) ? numOfStations[0] : 2;
        this.availableStoreStations = (numOfStations[1]>0) ? numOfStations[1] : 2;
        this.availableBNEStations = (numOfStations[2]>0) ? numOfStations[2] : 1;
        this.availableCallRetStations = (numOfStations[3]>0) ? numOfStations[3] : 1;
        this.availableAddAddiStations = (numOfStations[4]>0) ? numOfStations[4] : 3;
        this.availableDivStations = (numOfStations[5]>0) ? numOfStations[5] : 1; 
        this.availableNandStations = (numOfStations[6]>0) ? numOfStations[6] : 1;
    }
    
    private Memory : Memory;
    private RegisterFile : RegisterFile;    
    private instructions: string[];
    private startingaddress: number = 0;
    private availableLoadStations: number = 2;
    private availableStoreStations: number = 2;
    private availableBNEStations: number = 1;
    private availableCallRetStations: number = 1;
    private availableAddAddiStations: number = 3;
    private availableDivStations: number = 1;
    private availableNandStations: number = 1;
    private issueTime: number[];
    private startExecutionTime: number[];
    private endExecutionTime: number[];
    private writeTime: number[];
    private issueCounter : number = 0;
    private curClockCycle: number = 1;
    
    public executeInstructions(instruction: string[]): void {
        const opcode = instruction[0];
        for( ; this.issueCounter < instruction.length ; this.curClockCycle++) {
            switch (opcode) {
                case "LOAD":
                    if(this.availableLoadStations > 0) {
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