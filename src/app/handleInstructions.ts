import Memory from './memory';
import Station from './Station';
import RegisterFile from './registers';

type Pair = {
    station: string, index: number
}

class InstructionHandler {
    constructor(input: string, startingaddress: number, numOfStations: number[]) {
        alert(input)
        this.instructions             = input.split('\n');
        //this.startingaddress = startingaddress;
        this.memory                   = new Memory();
        this.registerFile             = new RegisterFile();
        this.availableLoadStations    = (numOfStations[0] > 0) ? numOfStations[0] : 2;
        this.availableStoreStations   = (numOfStations[1] > 0) ? numOfStations[1] : 2;
        this.availableBNEStations     = (numOfStations[2] > 0) ? numOfStations[2] : 1;
        this.availableCallRetStations = (numOfStations[3] > 0) ? numOfStations[3] : 1;
        this.availableAddAddiStations = (numOfStations[4] > 0) ? numOfStations[4] : 3;
        this.availableDivStations     = (numOfStations[5] > 0) ? numOfStations[5] : 1;
        this.availableNandStations    = (numOfStations[6] > 0) ? numOfStations[6] : 1;
        this.PC                       = startingaddress;
        this.issueTime                = new Array<number>(this.instructions.length);
        for( let i = 0 ; i < this.availableLoadStations ; i++ ) {
            let station = new Station();
            station.setName("Load");
            this.loadStations.push(station);
        }
        for( let i = 0 ; i < this.availableStoreStations ; i++ ) {
            let station = new Station();
            station.setName("Store");
            this.storeStations.push(station);
        }
        for( let i = 0 ; i < this.availableBNEStations ; i++ ) {
            let station = new Station();
            station.setName("BNE");
            this.bneStations.push(station);
        }
        for( let i = 0 ; i < this.availableCallRetStations ; i++ ) {
            let station = new Station();
            station.setName("CallRet");
            this.callRetStations.push(station);
        }
        for( let i = 0 ; i < this.availableAddAddiStations ; i++ ) {
            let station = new Station();
            station.setName("AddAddi");
            this.addAddiStations.push(station);
        }
        for( let i = 0 ; i < this.availableDivStations ; i++ ) {
            let station = new Station();
            station.setName("Div");
            this.divStations.push(station);
        }
        for( let i = 0 ; i < this.availableNandStations ; i++ ) {
            let station = new Station();
            station.setName("Nand");
            this.nandStations.push(station);
        }

        this.registerWrite  = new Array<Pair>(8);

        for (let i = 0; i < 8; i++) {
            this.registerWrite[i] = {station: "", index: -1};
        }
        this.executeInstructions(this.instructions);
    }

    private loadStations: Station[] = [];
    private storeStations: Station[] = [];
    private bneStations: Station[] = [];
    private callRetStations: Station[] = [];
    private addAddiStations: Station[] = [];
    private divStations: Station[] = [];
    private nandStations: Station[] = [];
    private memory: Memory;
    private registerFile: RegisterFile;
    private instructions: string[];
    private startingaddress: number = 0;
    private availableLoadStations: number = 2;
    private availableStoreStations: number = 2;
    private availableBNEStations: number = 1;
    private availableCallRetStations: number = 1;
    private availableAddAddiStations: number = 3;
    private availableDivStations: number = 1;
    private availableNandStations: number = 1;
    private registerWrite; 

    private PC: number;
    public issueTime;
    /*private startExecutionTime: number[];
    private endExecutionTime: number[];
    private writeTime: number[];*/
    private issueCounter: number = 0;
    private curClockCycle: number = 1;

    private issueInstruction(instruction: string[]):void{
        const opcode = instruction[0];
        switch (opcode) {
            case "LOAD":
                if (this.availableLoadStations > 0) {
                    for(let i = 0 ; i < this.loadStations.length ; i++) {
                        if(!this.loadStations[i].getBusy()) {
                            this.loadStations[i].setBusy(true);
                            this.loadStations[i].setOp(opcode);
                            let  dest = parseInt(instruction[1].substring(1, instruction[1].length - 1));
                            // let  offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                            let  base = parseInt(instruction[2][instruction[2].length - 2]);
                            if(this.registerWrite[base].station != "") {
                                this.loadStations[i].setVj(base);
                            }else {
                                this.loadStations[i].setQj(this.registerWrite[base]);
                            }
                            this.registerWrite[dest].station = this.loadStations[i].getName();
                            this.registerWrite[dest].index = i;
                            // part of execution this.loadStations[i].setA(offset+this.registerFile.readRegister(base));
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableLoadStations--;
                            break;
                        }
                    }
                }
                break;
            case "STORE":{
                if (this.availableStoreStations > 0) {
                    for(let i = 0 ; i < this.storeStations.length ; i++) {
                        if(!this.storeStations[i].getBusy()) {
                            this.storeStations[i].setBusy(true);
                            this.storeStations[i].setOp(opcode);
                            // let  offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                            let  rs1 = parseInt(instruction[2][instruction[2].length - 2]); // base
                            let  rs2 = parseInt(instruction[1].substring(1, instruction[1].length - 1));
                            if(this.registerWrite[rs1].station != "") {
                                this.storeStations[i].setVj(rs1);
                            }else {
                                this.storeStations[i].setQj(this.registerWrite[rs1]);
                            }
                            if(this.registerWrite[rs2].station != "") {
                                this.storeStations[i].setVk(rs2);
                            }else {
                                this.storeStations[i].setQk(this.registerWrite[rs2]);
                            }
                            // part of execution this.storeStations[i].setA(offset+this.registerFile.readRegister(base));
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableStoreStations--;
                            break;
                        }
                    }
                
                }
            }
                break;
            case "BNE":{
                if (this.availableBNEStations > 0) {
                    
                }

            }
                break;
            case "CALL":{

            }
                break;
            case "RET":{

            }
                break;
            case "ADD":{
                if (this.availableAddAddiStations > 0) {
                    for(let i = 0 ; i < this.addAddiStations.length ; i++) {
                        if(!this.addAddiStations[i].getBusy()) {
                            this.addAddiStations[i].setBusy(true);
                            this.addAddiStations[i].setOp(opcode);
                            let  dest = parseInt(instruction[1][1]);
                            let  src1 = parseInt(instruction[2][1]);
                            let  src2 = parseInt(instruction[3][1]);
                            if(this.registerWrite[src1].station != "") {
                                this.addAddiStations[i].setVj(src1);
                            }else {
                                this.addAddiStations[i].setQj(this.registerWrite[src1]);
                            }
                            if(this.registerWrite[src2].station != "") {
                                this.addAddiStations[i].setVk(src2);
                            }else {
                                this.addAddiStations[i].setQk(this.registerWrite[src2]);
                            }
                            this.registerWrite[dest].station = this.addAddiStations[i].getName();
                            this.registerWrite[dest].index = i
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableAddAddiStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "ADDI":{
                if (this.availableAddAddiStations > 0) {
                    for(let i = 0 ; i < this.addAddiStations.length ; i++) {
                        if(!this.addAddiStations[i].getBusy()) {
                            this.addAddiStations[i].setBusy(true);
                            this.addAddiStations[i].setOp(opcode);
                            let  dest = parseInt(instruction[1][1]);
                            let  src1 = parseInt(instruction[2][1]);
                            // let  imm = parseInt(instruction[3]);
                            if(this.registerWrite[src1].station != "") {
                                this.addAddiStations[i].setVj(src1);
                            }else {
                                this.addAddiStations[i].setQj(this.registerWrite[src1]);
                            }
                            this.registerWrite[dest].station = this.addAddiStations[i].getName();
                            this.registerWrite[dest].index = i;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableAddAddiStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "NAND":{
                if (this.availableNandStations > 0){
                    for(let i = 0 ; i < this.nandStations.length ; i++) {
                        if(!this.nandStations[i].getBusy()) {
                            this.nandStations[i].setBusy(true);
                            this.nandStations[i].setOp(opcode);
                            let  dest = parseInt(instruction[1][1]);
                            let  src1 = parseInt(instruction[2][1]);
                            let  src2 = parseInt(instruction[3][1]);
                            if(this.registerWrite[src1].station != "") {
                                this.nandStations[i].setVj(src1);
                            }else {
                                this.nandStations[i].setQj(this.registerWrite[src1]);
                            }
                            if(this.registerWrite[src2].station != "") {
                                this.nandStations[i].setVk(src2);
                            }else {
                                this.nandStations[i].setQk(this.registerWrite[src2]);
                            }
                            this.registerWrite[dest].station = this.nandStations[i].getName();
                            this.registerWrite[dest].index = i;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableNandStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "DIV":{
                if (this.availableDivStations > 0){
                    for(let i = 0 ; i < this.divStations.length ; i++) {
                        if(!this.divStations[i].getBusy()) {
                            this.divStations[i].setBusy(true);
                            this.divStations[i].setOp(opcode);
                            let  dest = parseInt(instruction[1][1]);
                            let  src1 = parseInt(instruction[2][1]);
                            let  src2 = parseInt(instruction[3][1]);
                            if(this.registerWrite[src1].station != "") {
                                this.divStations[i].setVj(src1);
                            }else {
                                this.divStations[i].setQj(this.registerWrite[src1]);
                            }
                            if(this.registerWrite[src2].station != "") {
                                this.divStations[i].setVk(src2);
                            }else {
                                this.divStations[i].setQk(this.registerWrite[src2]);
                            }
                            this.registerWrite[dest].station = this.divStations[i].getName();
                            this.registerWrite[dest].index = i;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableDivStations--;
                            break;
                        }
                    }
                }
            }
                break;
            default:
                throw new Error("Invalid opcode");
        }
    }

    public executeInstructions(instructions: string[]): void {
        for (let i = 0 ; i < instructions.length ; i++) { // fix loop over clock cycles
            let instruction = instructions[this.issueCounter].split(' ');    
            this.issueInstruction(instruction);
            this.curClockCycle++;
        }
    }
}

export default InstructionHandler;