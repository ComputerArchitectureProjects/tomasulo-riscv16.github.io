import Memory from './memory';
import Station from './Station';
import RegisterFile from './registers';
import BinaryHeap from './minheap';

type Pair = {
    station: string, index: number
}

type MinHeapPair = {
    writeTime: number, stationNumber: number, station: string
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
        this.startExecutionTime       = new Array<number>(this.instructions.length);
        this.endExecutionTime         = new Array<number>(this.instructions.length); 
        this.writeTime                = new Array<number>(this.instructions.length);
        this.registerWrite            = new Array<Pair>(8);
        this.minHeapWriting           = new BinaryHeap<MinHeapPair>((x: MinHeapPair) => x.writeTime);

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
        for (let i = 0; i < 8; i++) {
            this.registerWrite[i] = {station: "", index: -1};
        }


        this.tomasulo(this.instructions);
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
    private startExecutionTime;
    private endExecutionTime;
    private writeTime;
    private issueCounter: number = 0;
    private curClockCycle: number = 1;
    private minHeapWriting: BinaryHeap<MinHeapPair>;

    private issueInstruction(instruction: string[]):void{
        const opcode = instruction[0];
        switch (opcode) {
            case "LOAD":{
                if (this.availableLoadStations > 0) {
                    for(let i = 0 ; i < this.loadStations.length ; i++) {
                        if(!this.loadStations[i].getBusy()) {
                            this.loadStations[i].setBusy(true);
                            this.loadStations[i].setOp(opcode);
                            this.loadStations[i].setnumOfInstruction(this.issueCounter);
                            let  dest = parseInt(instruction[1].substring(1, instruction[1].length - 1));
                            // let  offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                            let  base = parseInt(instruction[2][instruction[2].length - 2]);
                            if(this.registerWrite[base].station === "") {
                                this.loadStations[i].setVj(this.registerFile.readRegister(base));
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
            }
                break;
            case "STORE":{
                if (this.availableStoreStations > 0) {
                    for(let i = 0 ; i < this.storeStations.length ; i++) {
                        if(!this.storeStations[i].getBusy()) {
                            this.storeStations[i].setBusy(true);
                            this.storeStations[i].setOp(opcode);
                            this.storeStations[i].setnumOfInstruction(this.issueCounter);
                            // let  offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                            let  rs1 = parseInt(instruction[2][instruction[2].length - 2]); // base
                            let  rs2 = parseInt(instruction[1].substring(1, instruction[1].length - 1));
                            if(this.registerWrite[rs1].station === "") {
                                this.storeStations[i].setVj(this.registerFile.readRegister(rs1));
                            }else {
                                this.storeStations[i].setQj(this.registerWrite[rs1]);
                            }
                            if(this.registerWrite[rs2].station === "") {
                                this.storeStations[i].setVk(this.registerFile.readRegister(rs2));
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
                    for(let i = 0 ; i < this.bneStations.length ; i++) {
                        if(!this.bneStations[i].getBusy()) {
                            this.bneStations[i].setBusy(true);
                            this.bneStations[i].setOp(opcode);
                            this.bneStations[i].setnumOfInstruction(this.issueCounter);
                            let  rs1 = parseInt(instruction[1][1]);
                            let  rs2 = parseInt(instruction[2][1]);
                            // let  imm = parseInt(instruction[3]);
                            if(this.registerWrite[rs1].station === "") {
                                this.bneStations[i].setVj(this.registerFile.readRegister(rs1));
                            }else {
                                this.bneStations[i].setQj(this.registerWrite[rs1]);
                            }
                            if(this.registerWrite[rs2].station === "") {
                                this.bneStations[i].setVk(this.registerFile.readRegister(rs2));
                            }else {
                                this.bneStations[i].setQk(this.registerWrite[rs2]);
                            }
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableBNEStations--;
                            break;
                        }
                    }
                }

            }
                break;
            case "CALL":
            case "RET":{
                if (this.availableCallRetStations) {
                    for(let i = 0 ; i < this.callRetStations.length ; i++) {
                        if(!this.callRetStations[i].getBusy()) {
                            this.callRetStations[i].setBusy(true);
                            this.callRetStations[i].setOp(opcode);
                            this.callRetStations[i].setnumOfInstruction(this.issueCounter);
                            let label = (opcode === "CALL") ? instruction[1] : null;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.issueCounter++;
                            this.availableCallRetStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "ADD":{
                if (this.availableAddAddiStations > 0) {
                    for(let i = 0 ; i < this.addAddiStations.length ; i++) {
                        if(!this.addAddiStations[i].getBusy()) {
                            this.addAddiStations[i].setBusy(true);
                            this.addAddiStations[i].setOp(opcode);
                            this.addAddiStations[i].setnumOfInstruction(this.issueCounter);
                            let  dest = parseInt(instruction[1][1]);
                            let  rs1 = parseInt(instruction[2][1]);
                            let  rs2 = parseInt(instruction[3][1]);
                            if(this.registerWrite[rs1].station === "") {
                                this.addAddiStations[i].setVj(this.registerFile.readRegister(rs1));
                            }else {
                                this.addAddiStations[i].setQj(this.registerWrite[rs1]);
                            }
                            if(this.registerWrite[rs2].station === "") {
                                this.addAddiStations[i].setVk(this.registerFile.readRegister(rs2));
                            }else {
                                this.addAddiStations[i].setQk(this.registerWrite[rs2]);
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
                            this.addAddiStations[i].setnumOfInstruction(this.issueCounter);
                            let  dest = parseInt(instruction[1][1]);
                            let  rs1 = parseInt(instruction[2][1]);
                            // let  imm = parseInt(instruction[3]);
                            if(this.registerWrite[rs1].station === "") {
                                this.addAddiStations[i].setVj(this.registerFile.readRegister(rs1));
                            }else {
                                this.addAddiStations[i].setQj(this.registerWrite[rs1]);
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
                            this.nandStations[i].setnumOfInstruction(this.issueCounter);
                            let  dest = parseInt(instruction[1][1]);
                            let  rs1 = parseInt(instruction[2][1]);
                            let  rs2 = parseInt(instruction[3][1]);
                            if(this.registerWrite[rs1].station === "") {
                                this.nandStations[i].setVj(this.registerFile.readRegister(rs1));
                            }else {
                                this.nandStations[i].setQj(this.registerWrite[rs1]);
                            }
                            if(this.registerWrite[rs2].station === "") {
                                this.nandStations[i].setVk(this.registerFile.readRegister(rs2));
                            }else {
                                this.nandStations[i].setQk(this.registerWrite[rs2]);
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
                            this.divStations[i].setnumOfInstruction(this.issueCounter);
                            let  dest = parseInt(instruction[1][1]);
                            let  rs1 = parseInt(instruction[2][1]);
                            let  rs2 = parseInt(instruction[3][1]);
                            if(this.registerWrite[rs1].station === "") {
                                this.divStations[i].setVj(this.registerFile.readRegister(rs1));
                            }else {
                                this.divStations[i].setQj(this.registerWrite[rs1]);
                            }
                            if(this.registerWrite[rs2].station === "") {
                                this.divStations[i].setVk(this.registerFile.readRegister(rs2));
                            }else {
                                this.divStations[i].setQk(this.registerWrite[rs2]);
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
            default:{
                throw new Error("Invalid opcode");
            }    
        }
    }
    // check pc of executing laod and store and call and ret
    public executeInstruction(): void {
        for(let i = 0 ; i < this.loadStations.length ; i++) {
            if(this.loadStations[i].getBusy() && this.startExecutionTime[this.loadStations[i].getnumOfInstruction()] == null) {
                if(this.loadStations[i].getVj() !== -1 && this.issueTime[this.loadStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    let instructionNumber = this.loadStations[i].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(' ');
                    let offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                    let base   = parseInt(instruction[2][instruction[2].length - 2]);
                    this.loadStations[i].setA(base+offset);
                    this.startExecutionTime[instructionNumber] = this.curClockCycle + 1;
                    this.endExecutionTime[instructionNumber] = this.curClockCycle + 2;
                    this.writeTime[instructionNumber] = this.curClockCycle + 3;
                    this.minHeapWriting.push({writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "LOAD"});
                    alert(this.minHeapWriting.peek().stationNumber +"station number");  
                    alert(this.minHeapWriting.peek().writeTime + "write time");
                }
            }
        }
        for(let i = 0 ; i < this.storeStations.length ; i++) {
            if(this.storeStations[i].getBusy() && this.startExecutionTime[this.storeStations[i].getnumOfInstruction()] == null) {
                if(this.storeStations[i].getVj() !== -1 && this.storeStations[i].getVk() !== -1 && this.issueTime[this.storeStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    let instructionNumber = this.storeStations[i].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(' ');
                    let offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                    let base   = parseInt(instruction[2][instruction[2].length - 2]);
                    this.storeStations[i].setA(base+offset);
                    this.startExecutionTime[instructionNumber] = this.curClockCycle +1 ;
                    this.endExecutionTime[instructionNumber] = this.curClockCycle + 2;
                    this.writeTime[instructionNumber] = this.curClockCycle + 3;
                    this.minHeapWriting.push({writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "STORE"});
                }
            }
        }
        for(let i = 0 ; i < this.bneStations.length ; i++) {
            if(this.bneStations[i].getBusy() && this.startExecutionTime[this.bneStations[i].getnumOfInstruction()] == null) {
                if(this.bneStations[i].getVj() !== -1 && this.bneStations[i].getVk() !== -1 && this.issueTime[this.bneStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    let instructionNumber = this.bneStations[i].getnumOfInstruction();
                    this.startExecutionTime[instructionNumber] = this.curClockCycle;
                    this.endExecutionTime[instructionNumber] = this.curClockCycle + 1;
                    this.writeTime[instructionNumber] = this.curClockCycle + 2;
                    this.minHeapWriting.push({writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "BNE"});
                }
            }
        
        }
        for (let i = 0; i < this.addAddiStations.length; i++) {
            if (this.addAddiStations[i].getBusy() && this.startExecutionTime[this.addAddiStations[i].getnumOfInstruction()] == null) {
                if (this.addAddiStations[i].getVj() !== -1 && this.issueTime[this.addAddiStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    let instructionNumber = this.addAddiStations[i].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(' ');
                    if (instruction[0] === "ADD" && this.addAddiStations[i].getVk() !== -1) {
                        this.startExecutionTime[instructionNumber] = this.curClockCycle;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle + 1;
                        this.writeTime[instructionNumber] = this.curClockCycle + 2;
                        this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "ADD" });
                        alert(this.minHeapWriting.peek().stationNumber + "station number");
                        alert(this.minHeapWriting.peek().writeTime + "write time");
                    } else if (instruction[0] === "ADDI") {
                        this.startExecutionTime[instructionNumber] = this.curClockCycle;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle + 1;
                        this.writeTime[instructionNumber] = this.curClockCycle + 2;
                        this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "ADDI" });
                        alert(this.minHeapWriting.peek().stationNumber + "station number");
                        alert(this.minHeapWriting.peek().writeTime + "write time");
                    }
                }
            }
        }

        for (let i = 0; i < this.nandStations.length; i++) {
            if (this.nandStations[i].getBusy() && this.startExecutionTime[this.nandStations[i].getnumOfInstruction()] == null) {
                if (this.nandStations[i].getVj() !== -1 && this.nandStations[i].getVk() !== -1 && this.issueTime[this.nandStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    let instructionNumber = this.nandStations[i].getnumOfInstruction();
                    this.startExecutionTime[instructionNumber] = this.curClockCycle;
                    this.endExecutionTime[instructionNumber] = this.curClockCycle;
                    this.writeTime[instructionNumber] = this.curClockCycle + 1;
                    this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "NAND" });
                    alert(this.minHeapWriting.peek().stationNumber + "station number");
                    alert(this.minHeapWriting.peek().writeTime + "write time");
                }
            }
        }

        for (let i = 0; i < this.divStations.length; i++) {
            if (this.divStations[i].getBusy() && this.startExecutionTime[this.divStations[i].getnumOfInstruction()] == null) {
                if (this.divStations[i].getVj() !== -1 && this.divStations[i].getVk() !== -1 && this.issueTime[this.divStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    let instructionNumber = this.divStations[i].getnumOfInstruction();
                    this.startExecutionTime[instructionNumber] = this.curClockCycle;
                    this.endExecutionTime[instructionNumber] = this.curClockCycle + 9;
                    this.writeTime[instructionNumber] = this.curClockCycle + 10;
                    this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "NAND" });
                    alert(this.minHeapWriting.peek().stationNumber + "station number");
                    alert(this.minHeapWriting.peek().writeTime + "write time");
                }
            }
        }

    }
    public tomasulo(instructions: string[]): void {
        for (let i = 0 ; i < instructions.length ; i++) { // fix loop over clock cycles
            let instruction = instructions[this.issueCounter].split(' ');    
            this.issueInstruction(instruction);
            this.executeInstruction();
            this.curClockCycle++;   
        }
    }
}

export default InstructionHandler;