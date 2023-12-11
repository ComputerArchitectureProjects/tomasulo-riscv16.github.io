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
        this.instructionMemory = input.split('\n');
        this.PC = startingaddress;
        this.startingaddress = startingaddress;
        this.memory = new Memory();
        this.registerFile = new RegisterFile();
        this.availableLoadStations = (numOfStations[0] > 0) ? numOfStations[0] : 2;
        this.availableStoreStations = (numOfStations[1] > 0) ? numOfStations[1] : 2;
        this.availableBNEStations = (numOfStations[2] > 0) ? numOfStations[2] : 1;
        this.availableCallRetStations = (numOfStations[3] > 0) ? numOfStations[3] : 1;
        this.availableAddAddiStations = (numOfStations[4] > 0) ? numOfStations[4] : 3;
        this.availableDivStations = (numOfStations[5] > 0) ? numOfStations[5] : 1;
        this.availableNandStations = (numOfStations[6] > 0) ? numOfStations[6] : 1;
        this.registerWrite = new Array<Pair>(8);
        this.issueTime = []
        this.startExecutionTime = []
        this.endExecutionTime = []
        this.writeTime = []
        this.minHeapWriting = new BinaryHeap<MinHeapPair>((x: MinHeapPair) => x.writeTime);

        for (let i = 0; i < this.availableLoadStations; i++) {
            let station = new Station();
            station.setName("LOAD");
            this.loadStations.push(station);
        }
        for (let i = 0; i < this.availableStoreStations; i++) {
            let station = new Station();
            station.setName("STORE");
            this.storeStations.push(station);
        }
        for (let i = 0; i < this.availableBNEStations; i++) {
            let station = new Station();
            station.setName("BNE");
            this.bneStations.push(station);
        }
        for (let i = 0; i < this.availableCallRetStations; i++) {
            let station = new Station();
            station.setName("CallRet");
            this.callRetStations.push(station);
        }
        for (let i = 0; i < this.availableAddAddiStations; i++) {
            let station = new Station();
            station.setName("AddAddi");
            this.addAddiStations.push(station);
        }
        for (let i = 0; i < this.availableDivStations; i++) {
            let station = new Station();
            station.setName("DIV");
            this.divStations.push(station);
        }
        for (let i = 0; i < this.availableNandStations; i++) {
            let station = new Station();
            station.setName("NAND");
            this.nandStations.push(station);
        }
        for (let i = 0; i < 8; i++) {
            this.registerWrite[i] = { station: "", index: -1 };
        }
        this.tomasulo();
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
    private instructionMemory: string[];
    private startingaddress: number = 0;
    private availableLoadStations: number = 2;
    private availableStoreStations: number = 2;
    private availableBNEStations: number = 1;
    private availableCallRetStations: number = 1;
    private availableAddAddiStations: number = 3;
    private availableDivStations: number = 1;
    private availableNandStations: number = 1;
    private bneFlag: number = -1;
    private bneFlagStationNumber: number = -1;
    private registerWrite;
    private PC: number;
    private issueCounter: number = 0;
    private curClockCycle: number = 1;
    private isIssued: boolean = false;
    private minHeapWriting: BinaryHeap<MinHeapPair>;
    public instructions: string[] = [];
    public issueTime: number[];
    public startExecutionTime: number[];
    public endExecutionTime: number[];
    public writeTime: number[];
    public IPC: number = 0;
    public totalExecutionTime: number = 0;
    public totalInstructions: number = 0;
    public branchMisprediction: number = 0;
    public totalBranches: number = 0;
    public branchMispredictionRate: number = 0;

    private resetBneFlags(): void {
        this.bneFlag = -1;
        this.bneFlagStationNumber = -1;
    }

    private cleanInstruction(instruction: string[]): string[] {
        instruction.forEach((value, index, arr) => {
            arr[index] = value.replace(/(\r\n|\n|\r)/gm, '');
        });
        return instruction;
    }

    private flushIssuing(instructionNumber: number): void {
        for (let i = 0; i < this.loadStations.length; i++) {
            if (this.loadStations[i].getnumOfInstruction() > instructionNumber) {
                this.loadStations[i].reset();
                this.availableLoadStations++
            }
        }
        for (let i = 0; i < this.storeStations.length; i++) {
            if (this.storeStations[i].getnumOfInstruction() > instructionNumber) {
                this.storeStations[i].reset();
                this.availableStoreStations++
            }
        }
        for (let i = 0; i < this.bneStations.length; i++) {
            if (this.bneStations[i].getnumOfInstruction() > instructionNumber) {
                this.bneStations[i].reset();
                this.availableBNEStations++
            }
        }
        for (let i = 0; i < this.callRetStations.length; i++) {
            if (this.callRetStations[i].getnumOfInstruction() > instructionNumber) {
                this.callRetStations[i].reset();
                this.availableCallRetStations++
            }
        }
        for (let i = 0; i < this.addAddiStations.length; i++) {
            if (this.addAddiStations[i].getnumOfInstruction() > instructionNumber) {
                this.addAddiStations[i].reset();
                this.availableAddAddiStations++
            }
        }
        for (let i = 0; i < this.divStations.length; i++) {
            if (this.divStations[i].getnumOfInstruction() > instructionNumber) {
                this.divStations[i].reset();
                this.availableDivStations++
            }
        }
        for (let i = 0; i < this.nandStations.length; i++) {
            if (this.nandStations[i].getnumOfInstruction() > instructionNumber) {
                this.nandStations[i].reset();
                this.availableNandStations++
            }
        }
    }

    private updateReservationStation(RS: Pair, value: number): void {
        for (let i = 0; i < this.loadStations.length; i++) {
            if (this.loadStations[i].getBusy() && this.loadStations[i].getQj().station === RS.station && this.loadStations[i].getQj().index === RS.index) {
                this.loadStations[i].setVj(value);
                this.loadStations[i].setQj({ station: "", index: -1 });
            }
            if (this.loadStations[i].getBusy() && this.loadStations[i].getQk().station === RS.station && this.loadStations[i].getQk().index === RS.index) {
                this.loadStations[i].setVk(value);
                this.loadStations[i].setQk({ station: "", index: -1 });
            }
        }
        for (let i = 0; i < this.storeStations.length; i++) {
            if (this.storeStations[i].getBusy() && this.storeStations[i].getQj().station === RS.station && this.storeStations[i].getQj().index === RS.index) {
                this.storeStations[i].setVj(value);
                this.storeStations[i].setQj({ station: "", index: -1 });
            }
            if (this.storeStations[i].getBusy() && this.storeStations[i].getQk().station === RS.station && this.storeStations[i].getQk().index === RS.index) {
                this.storeStations[i].setVk(value);
                this.storeStations[i].setQk({ station: "", index: -1 });
            }
        }
        for (let i = 0; i < this.bneStations.length; i++) {
            if (this.bneStations[i].getBusy() && this.bneStations[i].getQj().station === RS.station && this.bneStations[i].getQj().index === RS.index) {
                this.bneStations[i].setVj(value);
                this.bneStations[i].setQj({ station: "", index: -1 });
            }
            //alert("BNE WRITE BACK")
            //alert(this.bneStations[i].getBusy() + " " + this.bneStations[i].getQk().station + " " + this.bneStations[i].getQk().index + " " + RS.station + " " + RS.index + " " + this.bneStations[i].getQj().station + " " + this.bneStations[i].getQj().index + " " + this.bneStations[i].getVj() + " " + this.bneStations[i].getVk() + " " + value + " " + this.bneStations[i].getnumOfInstruction() + " " + this.bneStations[i].getOp())
            if (this.bneStations[i].getBusy() && this.bneStations[i].getQk().station === RS.station && this.bneStations[i].getQk().index === RS.index) {
                this.bneStations[i].setVk(value);
                this.bneStations[i].setQk({ station: "", index: -1 });
            }
        }
        for (let i = 0; i < this.callRetStations.length; i++) {
            if (this.callRetStations[i].getBusy() && this.callRetStations[i].getQj().station === RS.station && this.callRetStations[i].getQj().index === RS.index) {
                this.callRetStations[i].setVj(value);
                this.callRetStations[i].setQj({ station: "", index: -1 });
            }
            if (this.callRetStations[i].getBusy() && this.callRetStations[i].getQk().station === RS.station && this.callRetStations[i].getQk().index === RS.index) {
                this.callRetStations[i].setVk(value);
                this.callRetStations[i].setQk({ station: "", index: -1 });
            }
        }
        for (let i = 0; i < this.addAddiStations.length; i++) {
            //alert("IN ADDI UPDATE, index: " + i)
            //alert("RS: station: " + RS.station + " index: " + RS.index)
            //alert("station: " + this.addAddiStations[i].getQj().station + " index: " + this.addAddiStations[i].getQj().index)
            if (this.addAddiStations[i].getBusy() && this.addAddiStations[i].getQj().station === RS.station && this.addAddiStations[i].getQj().index === RS.index) {
                this.addAddiStations[i].setVj(value);
                //alert("INSIDE addi WRITE BACK, VJ IS: " + this.addAddiStations[i].getVj())
                this.addAddiStations[i].setQj({ station: "", index: -1 });
            }
            if (this.addAddiStations[i].getBusy() && this.addAddiStations[i].getQk().station === RS.station && this.addAddiStations[i].getQk().index === RS.index) {
                this.addAddiStations[i].setVk(value);
                //alert("INSIDE addi WRITE BACK, VK IS: " + this.addAddiStations[i].getVk())
                this.addAddiStations[i].setQk({ station: "", index: -1 });
            }
        }
        for (let i = 0; i < this.divStations.length; i++) {
            if (this.divStations[i].getBusy() && this.divStations[i].getQj().station === RS.station && this.divStations[i].getQj().index === RS.index) {
                this.divStations[i].setVj(value);
                this.divStations[i].setQj({ station: "", index: -1 });
            }
            if (this.divStations[i].getBusy() && this.divStations[i].getQk().station === RS.station && this.divStations[i].getQk().index === RS.index) {
                this.divStations[i].setVk(value);
                this.divStations[i].setQk({ station: "", index: -1 });
            }
        }
        for (let i = 0; i < this.nandStations.length; i++) {
            if (this.nandStations[i].getBusy() && this.nandStations[i].getQj().station === RS.station && this.nandStations[i].getQj().index === RS.index) {
                this.nandStations[i].setVj(value);
                this.nandStations[i].setQj({ station: "", index: -1 });
            }
            if (this.nandStations[i].getBusy() && this.nandStations[i].getQk().station === RS.station && this.nandStations[i].getQk().index === RS.index) {
                this.nandStations[i].setVk(value);
                this.nandStations[i].setQk({ station: "", index: -1 });
            }
        }
    }

    private issueInstruction(instruction: string[]): void {
        instruction = this.cleanInstruction(instruction);
        const opcode = instruction[0];
        switch (opcode) {
            case "LOAD": {
                if (this.availableLoadStations > 0) {
                    //alert(" in LOAD")
                    for (let i = 0; i < this.loadStations.length; i++) {
                        if (!this.loadStations[i].getBusy()) {
                            this.loadStations[i].setBusy(true);
                            this.loadStations[i].setOp(opcode);
                            this.loadStations[i].setnumOfInstruction(this.issueCounter);
                            let dest = parseInt(instruction[1].substring(1, instruction[1].length - 1));
                            // let  offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                            let base = parseInt(instruction[2][instruction[2].length - 2]);
                            if (this.registerWrite[base].station === "") {
                                this.loadStations[i].setVj(this.registerFile.readRegister(base));
                            } else {
                                this.loadStations[i].setQj(Object.assign({}, this.registerWrite[base]));
                            }
                            this.registerWrite[dest].station = this.loadStations[i].getName();
                            this.registerWrite[dest].index = i;
                            // part of execution this.loadStations[i].setA(offset+this.registerFile.readRegister(base));
                            // this.PC++;
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            this.availableLoadStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "STORE": {
                if (this.availableStoreStations > 0) {
                    for (let i = 0; i < this.storeStations.length; i++) {
                        if (!this.storeStations[i].getBusy()) {
                            this.storeStations[i].setBusy(true);
                            this.storeStations[i].setOp(opcode);
                            this.storeStations[i].setnumOfInstruction(this.issueCounter);
                            // let  offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                            let rs1 = parseInt(instruction[2][instruction[2].length - 2]); // base
                            let rs2 = parseInt(instruction[1].substring(1, instruction[1].length - 1));
                            if (this.registerWrite[rs1].station === "") {
                                this.storeStations[i].setVj(this.registerFile.readRegister(rs1));
                            } else {
                                this.storeStations[i].setQj(Object.assign({}, this.registerWrite[rs1]));
                            }
                            if (this.registerWrite[rs2].station === "") {
                                this.storeStations[i].setVk(this.registerFile.readRegister(rs2));
                            } else {
                                this.storeStations[i].setQk(Object.assign({}, this.registerWrite[rs2]));
                            }
                            // part of execution this.storeStations[i].setA(offset+this.registerFile.readRegister(base));
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            this.availableStoreStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "BNE": {
                if (this.availableBNEStations > 0) {
                    for (let i = 0; i < this.bneStations.length; i++) {
                        if (!this.bneStations[i].getBusy()) {
                            this.bneStations[i].setBusy(true);
                            this.bneStations[i].setOp(opcode);
                            this.bneStations[i].setnumOfInstruction(this.issueCounter);
                            let rs1 = parseInt(instruction[1][1]);
                            let rs2 = parseInt(instruction[2][1]);
                            // let  imm = parseInt(instruction[3]);
                            if (this.registerWrite[rs1].station === "") {
                                this.bneStations[i].setVj(this.registerFile.readRegister(rs1));
                            } else {
                                this.bneStations[i].setQj(Object.assign({}, this.registerWrite[rs1]));
                            }
                            if (this.registerWrite[rs2].station === "") {
                                this.bneStations[i].setVk(this.registerFile.readRegister(rs2));
                            } else {
                                this.bneStations[i].setQk(Object.assign({}, this.registerWrite[rs2]));
                            }
                            this.bneStations[i].setA(this.PC + 1 + parseInt(instruction[3]));
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            if (this.bneFlag === -1) {
                                this.bneFlag = this.issueCounter;
                                this.bneFlagStationNumber = i;
                            }
                            this.availableBNEStations--;
                            break;
                        }
                    }
                }

            }
                break;
            case "CALL":
            case "RET": {
                if (this.availableCallRetStations) {
                    for (let i = 0; i < this.callRetStations.length; i++) {
                        if (!this.callRetStations[i].getBusy()) {
                            this.callRetStations[i].setBusy(true);
                            this.callRetStations[i].setOp(opcode);
                            this.callRetStations[i].setnumOfInstruction(this.issueCounter);
                            if (opcode === "RET") {
                                if (this.registerWrite[1].station === "") {
                                    this.callRetStations[i].setVj(this.registerFile.readRegister(1));
                                } else {
                                    this.callRetStations[i].setQj(Object.assign({}, this.registerWrite[1]));
                                }
                            }
                            let label = (opcode === "CALL") ? instruction[1] : null;
                            if (opcode === "CALL") {
                                this.registerWrite[1].station = this.callRetStations[i].getName();
                                this.registerWrite[1].index = i;
                            }
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            this.availableCallRetStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "ADD": {
                if (this.availableAddAddiStations > 0) {
                    for (let i = 0; i < this.addAddiStations.length; i++) {
                        if (!this.addAddiStations[i].getBusy()) {
                            this.addAddiStations[i].setBusy(true);
                            this.addAddiStations[i].setOp(opcode);
                            this.addAddiStations[i].setnumOfInstruction(this.issueCounter);
                            let dest = parseInt(instruction[1][1]);
                            let rs1 = parseInt(instruction[2][1]);
                            let rs2 = parseInt(instruction[3][1]);
                            if (this.registerWrite[rs1].station === "") {
                                this.addAddiStations[i].setVj(this.registerFile.readRegister(rs1));
                            } else {
                                this.addAddiStations[i].setQj(Object.assign({}, this.registerWrite[rs1]));
                            }
                            if (this.registerWrite[rs2].station === "") {
                                this.addAddiStations[i].setVk(this.registerFile.readRegister(rs2));
                            } else {
                                this.addAddiStations[i].setQk(Object.assign({}, this.registerWrite[rs2]));
                            }
                            this.registerWrite[dest].station = this.addAddiStations[i].getName();
                            this.registerWrite[dest].index = i
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            this.availableAddAddiStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "ADDI": {
                if (this.availableAddAddiStations > 0) {
                    for (let i = 0; i < this.addAddiStations.length; i++) {
                        if (!this.addAddiStations[i].getBusy()) {
                            //alert("in addi")
                            this.addAddiStations[i].setBusy(true);
                            this.addAddiStations[i].setOp(opcode);
                            this.addAddiStations[i].setnumOfInstruction(this.issueCounter);
                            let dest = parseInt(instruction[1][1]);
                            let rs1 = parseInt(instruction[2][1]);
                            // let  imm = parseInt(instruction[3]);
                            if (this.registerWrite[rs1].station === "") {
                                this.addAddiStations[i].setVj(this.registerFile.readRegister(rs1));
                                //alert("in addi ISSUE, VJ IS: " + this.addAddiStations[i].getVj())
                            } else {
                                this.addAddiStations[i].setQj(Object.assign({}, this.registerWrite[rs1]));
                                //alert("IN ADDI ISSUE, QJ IS: " + this.addAddiStations[i].getQj().station + " " + this.addAddiStations[i].getQj().index)
                                //alert("Index in issue is: " + i)
                            }
                            this.registerWrite[dest].station = this.addAddiStations[i].getName();
                            this.registerWrite[dest].index = i;
                            //alert("INDEX IN ISSUE IS: " + i)
                            //alert("regWrite station: " + this.registerWrite[dest].station + " index: " + this.registerWrite[dest].index)
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            this.availableAddAddiStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "NAND": {
                if (this.availableNandStations > 0) {
                    for (let i = 0; i < this.nandStations.length; i++) {
                        if (!this.nandStations[i].getBusy()) {
                            this.nandStations[i].setBusy(true);
                            this.nandStations[i].setOp(opcode);
                            this.nandStations[i].setnumOfInstruction(this.issueCounter);
                            let dest = parseInt(instruction[1][1]);
                            let rs1 = parseInt(instruction[2][1]);
                            let rs2 = parseInt(instruction[3][1]);
                            if (this.registerWrite[rs1].station === "") {
                                this.nandStations[i].setVj(this.registerFile.readRegister(rs1));
                            } else {
                                this.nandStations[i].setQj(Object.assign({}, this.registerWrite[rs1]));
                            }
                            if (this.registerWrite[rs2].station === "") {
                                this.nandStations[i].setVk(this.registerFile.readRegister(rs2));
                            } else {
                                this.nandStations[i].setQk(Object.assign({}, this.registerWrite[rs2]));
                            }
                            this.registerWrite[dest].station = this.nandStations[i].getName();
                            this.registerWrite[dest].index = i;
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            this.availableNandStations--;
                            break;
                        }
                    }
                }
            }
                break;
            case "DIV": {
                if (this.availableDivStations > 0) {
                    for (let i = 0; i < this.divStations.length; i++) {
                        if (!this.divStations[i].getBusy()) {
                            this.divStations[i].setBusy(true);
                            this.divStations[i].setOp(opcode);
                            this.divStations[i].setnumOfInstruction(this.issueCounter);
                            let dest = parseInt(instruction[1][1]);
                            let rs1 = parseInt(instruction[2][1]);
                            let rs2 = parseInt(instruction[3][1]);
                            if (this.registerWrite[rs1].station === "") {
                                this.divStations[i].setVj(this.registerFile.readRegister(rs1));
                            } else {
                                this.divStations[i].setQj(Object.assign({}, this.registerWrite[rs1]));
                            }
                            if (this.registerWrite[rs2].station === "") {
                                this.divStations[i].setVk(this.registerFile.readRegister(rs2));
                            } else {
                                this.divStations[i].setQk(Object.assign({}, this.registerWrite[rs2]));
                            }
                            this.registerWrite[dest].station = this.divStations[i].getName();
                            this.registerWrite[dest].index = i;
                            this.isIssued = true;
                            this.issueTime[this.issueCounter] = this.curClockCycle;
                            this.instructions.push(instruction.join(" "));
                            this.availableDivStations--;
                            break;
                        }
                    }
                }
            }
                break;
            default: {
                alert("Invalid opcode" + opcode);
                throw new Error("Invalid opcode");
            }
        }
    }
    // check pc of executing laod and store and call and ret
    public executeInstruction(): void {
        for (let i = 0; i < this.bneStations.length; i++) {
            if (this.bneStations[i].getBusy() && this.startExecutionTime[this.bneStations[i].getnumOfInstruction()] == null) {
                if (this.bneStations[i].getQj().index === -1 && this.bneStations[i].getQk().index === -1 && this.issueTime[this.bneStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    if (this.bneFlag === this.bneStations[i].getnumOfInstruction()) {
                        let instructionNumber = this.bneStations[i].getnumOfInstruction();
                        // SET IN A CURRENT CLOCK CYCLE OR THIS.PC
                        this.startExecutionTime[instructionNumber] = this.curClockCycle;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle + 1;
                        this.writeTime[instructionNumber] = this.curClockCycle + 2;
                        //this.bneFlagStationNumber = i;
                        //this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "BNE" });
                    }
                }
            }
        }
        for (let i = 0; i < this.loadStations.length; i++) {
            if (this.loadStations[i].getBusy() && this.startExecutionTime[this.loadStations[i].getnumOfInstruction()] == null) {
                if (this.loadStations[i].getQj().index === -1 && this.issueTime[this.loadStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    if (this.bneFlag > this.loadStations[i].getnumOfInstruction() || this.bneFlag === -1) {
                        //alert("in load execute")
                        let instructionNumber = this.loadStations[i].getnumOfInstruction();
                        let instruction = this.instructions[instructionNumber].split(" ");
                        instruction = this.cleanInstruction(instruction);
                        let offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                        let base = parseInt(instruction[2][instruction[2].length - 2]);
                        this.loadStations[i].setA(this.registerFile.readRegister(base) + offset);
                        this.startExecutionTime[instructionNumber] = this.curClockCycle + 1;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle + 2;
                        this.writeTime[instructionNumber] = this.curClockCycle + 3;
                        this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "LOAD" });
                        /*alert(i + " LOAD station number");
                        alert(this.issueTime[instructionNumber] + " LOAD issue time");
                        alert(this.startExecutionTime[instructionNumber] + " LOAD exec start time");
                        alert(this.endExecutionTime[instructionNumber] + " LOAD exec fin time");
                        alert(this.writeTime[instructionNumber] + " LOAD write time");
                        alert(instruction);*/
                    }
                }
            }
        }
        for (let i = 0; i < this.storeStations.length; i++) {
            if (this.storeStations[i].getBusy() && this.startExecutionTime[this.storeStations[i].getnumOfInstruction()] == null) {
                if (this.storeStations[i].getQj().index === -1 && this.storeStations[i].getQk().index === -1 && this.issueTime[this.storeStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    if (this.bneFlag > this.storeStations[i].getnumOfInstruction() || this.bneFlag === -1) {
                        let instructionNumber = this.storeStations[i].getnumOfInstruction();
                        let instruction = this.instructions[instructionNumber].split(" ");
                        instruction = this.cleanInstruction(instruction);
                        let offset = parseInt(instruction[2].substring(0, instruction[2].length - 1));
                        let base = parseInt(instruction[2][instruction[2].length - 2]);
                        this.storeStations[i].setA(this.registerFile.readRegister(base) + offset);
                        this.startExecutionTime[instructionNumber] = this.curClockCycle + 1;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle + 2;
                        this.writeTime[instructionNumber] = this.curClockCycle + 3;
                        this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "STORE" });
                        //alert(i + "STORE station number");
                        //alert(this.writeTime[instructionNumber] + "STORE write time");
                    }
                }
            }
        }
        for (let i = 0; i < this.addAddiStations.length; i++) {
            if (this.addAddiStations[i].getBusy() && this.startExecutionTime[this.addAddiStations[i].getnumOfInstruction()] == null) {
                if (this.addAddiStations[i].getQj().index === -1 && this.issueTime[this.addAddiStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    if (this.bneFlag > this.addAddiStations[i].getnumOfInstruction() || this.bneFlag === -1) {
                        let instructionNumber = this.addAddiStations[i].getnumOfInstruction();
                        let instruction = this.instructions[instructionNumber].split(" ");
                        instruction = this.cleanInstruction(instruction);
                        if (instruction[0] === "ADD" && this.addAddiStations[i].getQk().index === -1) {
                            //         alert("in add execute")
                            this.startExecutionTime[instructionNumber] = this.curClockCycle;
                            this.endExecutionTime[instructionNumber] = this.curClockCycle + 1;
                            this.writeTime[instructionNumber] = this.curClockCycle + 2;
                            //alert("ADD write time: " + this.writeTime[instructionNumber])
                            this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "AddAddi" });
                            //alert(this.minHeapWriting.peek().stationNumber + "station number");
                            //alert(this.minHeapWriting.peek().writeTime + "write time");
                        } else if (instruction[0] === "ADDI") {
                            //         alert("in addi execute")
                            this.startExecutionTime[instructionNumber] = this.curClockCycle;
                            this.endExecutionTime[instructionNumber] = this.curClockCycle + 1;
                            this.writeTime[instructionNumber] = this.curClockCycle + 2;
                            //         alert("ADDI write time: " + this.writeTime[instructionNumber])
                            this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "AddAddi" });
                            //alert(this.minHeapWriting.peek().stationNumber + "station number");
                            //alert("ADDI write time in heap: " + this.minHeapWriting.peek().writeTime);
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.nandStations.length; i++) {
            if (this.nandStations[i].getBusy() && this.startExecutionTime[this.nandStations[i].getnumOfInstruction()] == null) {
                if (this.nandStations[i].getQj().index === -1 && this.nandStations[i].getQk().index === -1 && this.issueTime[this.nandStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    if (this.bneFlag > this.nandStations[i].getnumOfInstruction() || this.bneFlag === -1) {
                        let instructionNumber = this.nandStations[i].getnumOfInstruction();
                        this.startExecutionTime[instructionNumber] = this.curClockCycle;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle;
                        this.writeTime[instructionNumber] = this.curClockCycle + 1;
                        //      alert("NAND writeTime: " + this.writeTime[instructionNumber])
                        this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "NAND" });
                        //alert(this.minHeapWriting.peek().stationNumber + "station number");
                        //alert("NAND write time in heap: " + this.minHeapWriting.peek().writeTime);
                    }
                }
            }
        }

        for (let i = 0; i < this.divStations.length; i++) {
            if (this.divStations[i].getBusy() && this.startExecutionTime[this.divStations[i].getnumOfInstruction()] == null) {
                if (this.divStations[i].getQj().index === -1 && this.divStations[i].getQk().index === -1 && this.issueTime[this.divStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    if (this.bneFlag > this.divStations[i].getnumOfInstruction() || this.bneFlag === -1) {
                        let instructionNumber = this.divStations[i].getnumOfInstruction();
                        this.startExecutionTime[instructionNumber] = this.curClockCycle;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle + 9;
                        this.writeTime[instructionNumber] = this.curClockCycle + 10;
                        this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "DIV" });
                        //          alert(this.minHeapWriting.peek().stationNumber + "station number");
                        //          alert(this.minHeapWriting.peek().writeTime + "write time");
                    }
                }
            }
        }

        for (let i = 0; i < this.callRetStations.length; i++) {
            if (this.callRetStations[i].getBusy() && this.startExecutionTime[this.callRetStations[i].getnumOfInstruction()] == null) {
                if (this.issueTime[this.callRetStations[i].getnumOfInstruction()] < this.curClockCycle) {
                    if (this.bneFlag > this.callRetStations[i].getnumOfInstruction() || this.bneFlag === -1) {
                        //alert(this.issueTime[this.callRetStations[i].getnumOfInstruction()] + " execute time of RET " + this.curClockCycle + " " + this.PC)
                        let instructionNumber = this.callRetStations[i].getnumOfInstruction();
                        this.startExecutionTime[instructionNumber] = this.curClockCycle;
                        this.endExecutionTime[instructionNumber] = this.curClockCycle;
                        this.writeTime[instructionNumber] = this.curClockCycle + 1;
                        //alert("RET write time: " + this.callRetStations[i].getOp())
                        if (this.callRetStations[i].getOp() === "RET") {
                            this.PC = this.callRetStations[i].getVj();
                            //alert(this.issueCounter + " issue counter RET")
                            //alert("indsie ret execute")
                            this.callRetStations[i].reset();
                            this.availableCallRetStations++;
                        } else if (this.callRetStations[i].getOp() === "CALL") {
                            this.PC = parseInt(this.instructions[instructionNumber].split(" ")[1]);
                        }
                        if (this.callRetStations[i].getOp() === "CALL") {
                            this.minHeapWriting.push({ writeTime: this.writeTime[instructionNumber], stationNumber: i, station: "CALL" });
                        }
                    }
                }
            }
        }
    }
    public writeInstruction(): void {
        if (this.bneFlag !== -1) {
            if (this.writeTime[this.bneFlag] <= this.curClockCycle) {
                let instructionNumber = this.bneStations[this.bneFlagStationNumber].getnumOfInstruction();
                let instruction = this.instructions[instructionNumber].split(" ");
                instruction = this.cleanInstruction(instruction);
                let rs1 = parseInt(instruction[1][1]);
                let rs2 = parseInt(instruction[2][1]);
                let imm = parseInt(instruction[3]);
                if (this.bneStations[this.bneFlagStationNumber].getVj() !== this.bneStations[this.bneFlagStationNumber].getVk()) {
                    this.PC = this.bneStations[this.bneFlagStationNumber].getA() // fixxxxxxxxxxxxxxxxxx
                    this.branchMisprediction++;
                    this.flushIssuing(instructionNumber);
                }
                this.totalBranches++;
                this.bneStations[this.bneFlagStationNumber].reset();
                this.availableBNEStations++;
                this.writeTime[instructionNumber] = this.curClockCycle;
                this.resetBneFlags();
            }
        }
        //alert("in write " + this.minHeapWriting.isEmpty())
        if (!this.minHeapWriting.isEmpty() && this.minHeapWriting.peek().writeTime <= this.curClockCycle) {
            //    alert("in write, cycle " + this.curClockCycle)
            let min = this.minHeapWriting.pop();
            let stationNumber = min.stationNumber;
            let station = min.station;
            //    alert("station: " + station + " station number: " + stationNumber);
            switch (station) {
                case "LOAD": {
                    let A = this.loadStations[stationNumber].getA();
                    let value = this.memory.readMemory(A);
                    let instructionNumber = this.loadStations[stationNumber].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(" ");
                    instruction = this.cleanInstruction(instruction);
                    let dest = parseInt(instruction[1].substring(1, instruction[1].length - 1));
                    this.registerFile.writeRegister(dest, value);
                    this.availableLoadStations++;
                    this.writeTime[instructionNumber] = this.curClockCycle;
                    //            alert(this.writeTime[instructionNumber] + " actual LOAD write time");
                    this.updateReservationStation({ station: station, index: stationNumber }, value);
                    this.registerWrite[dest].station = "";
                    this.registerWrite[dest].index = -1;
                    this.loadStations[stationNumber].reset();
                }
                    break;
                case "STORE": {
                    let A = this.storeStations[stationNumber].getA();
                    let value = this.storeStations[stationNumber].getVk();
                    let instructionNumber = this.storeStations[stationNumber].getnumOfInstruction();
                    this.memory.writeMemory(A, value);
                    this.availableStoreStations++;
                    this.writeTime[instructionNumber] = this.curClockCycle;
                    this.storeStations[stationNumber].reset();
                }
                    break;
                case "AddAddi": {
                    let instructionNumber = this.addAddiStations[stationNumber].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(" ");
                    instruction = this.cleanInstruction(instruction);
                    let opcode = this.addAddiStations[stationNumber].getOp();
                    let dest = parseInt(instruction[1][1]);
                    //alert("VJ IS: " + this.addAddiStations[stationNumber].getVj() + " VK IS: " + this.addAddiStations[stationNumber].getVk())
                    let value = this.addAddiStations[stationNumber].getVj() + (opcode === "ADD" ? this.addAddiStations[stationNumber].getVk() : parseInt(instruction[3]));
                    this.registerFile.writeRegister(dest, value);
                    this.availableAddAddiStations++
                    //            alert("INSIDE ADDI WRITE: " + this.availableAddAddiStations)
                    this.writeTime[instructionNumber] = this.curClockCycle;
                    //            alert("actual ADD write time: " + this.writeTime[instructionNumber])
                    //alert("I WILL START UPDATING NOW WITH STATION: " + station + " AND INDEX: " + stationNumber)
                    this.updateReservationStation({ station: station, index: stationNumber }, value);
                    //alert("THE VALUE IS: " + value)
                    this.registerWrite[dest].station = "";
                    this.registerWrite[dest].index = -1;
                    this.addAddiStations[stationNumber].reset();
                }
                    break;
                case "NAND": {
                    let instructionNumber = this.nandStations[stationNumber].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(" ");
                    instruction = this.cleanInstruction(instruction);
                    let dest = parseInt(instruction[1][1]);
                    let value = ~(this.nandStations[stationNumber].getVj() & this.nandStations[stationNumber].getVk());
                    this.registerFile.writeRegister(dest, value);
                    this.availableNandStations++;
                    this.writeTime[instructionNumber] = this.curClockCycle;
                    this.updateReservationStation({ station: station, index: stationNumber }, value);
                    this.registerWrite[dest].station = "";
                    this.registerWrite[dest].index = -1;
                    this.nandStations[stationNumber].reset();
                }
                    break;
                case "DIV": {
                    let instructionNumber = this.divStations[stationNumber].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(" ");
                    instruction = this.cleanInstruction(instruction);
                    let dest = parseInt(instruction[1][1]);
                    let value = this.divStations[stationNumber].getVj() / this.divStations[stationNumber].getVk();
                    // float ? int ?
                    this.registerFile.writeRegister(dest, value);
                    this.availableDivStations++;
                    this.writeTime[instructionNumber] = this.curClockCycle;
                    this.updateReservationStation({ station: station, index: stationNumber }, value);
                    this.registerWrite[dest].station = "";
                    this.registerWrite[dest].index = -1;
                    this.divStations[stationNumber].reset();

                }
                    break;
                case "CALL": {
                    let instructionNumber = this.callRetStations[stationNumber].getnumOfInstruction();
                    let instruction = this.instructions[instructionNumber].split(" ");
                    instruction = this.cleanInstruction(instruction);
                    let label = instruction[1];
                    // assume calculated in execute
                    // check execution 
                    let value = this.callRetStations[stationNumber].getnumOfInstruction() + 1;
                    this.registerFile.writeRegister(1, value);
                    // this.issueCounter = value - 1 + parseInt(label);
                    this.availableCallRetStations++;
                    this.writeTime[instructionNumber] = this.curClockCycle;
                    this.flushIssuing(instructionNumber);
                    this.updateReservationStation({ station: station, index: stationNumber }, value);
                    this.registerWrite[1].station = "";
                    this.registerWrite[1].index = -1;
                    this.callRetStations[stationNumber].reset();
                }
                    break;
                default: {
                    //alert("Invalid station name" + station);
                    throw new Error("Invalid station name");
                }
            }
        }
    }
    public tomasulo(): void {
        do {
            let curInstruction = this.instructionMemory[this.PC - this.startingaddress];
            if (curInstruction !== undefined) {
                let instruction = curInstruction.split(' ');
                instruction = this.cleanInstruction(instruction);
                this.issueInstruction(instruction);
            }
            this.executeInstruction();
            this.writeInstruction();
            if (this.isIssued) {
                this.PC++;
                this.issueCounter++;
                this.isIssued = false;
            }
            this.curClockCycle++;
        } while (this.PC < this.instructionMemory.length + this.startingaddress - 1 || !this.areStationsEmpty())
        this.totalExecutionTime = this.curClockCycle;
        this.totalInstructions = this.instructions.length;
        this.IPC = this.totalInstructions / this.curClockCycle;
        this.branchMispredictionRate = this.branchMisprediction / this.totalBranches;
    }

    private areStationsEmpty(): boolean {
        for (let i = 0; i < this.loadStations.length; i++) {
            if (this.loadStations[i].getBusy()) {
                return false;
            }
        }
        for (let i = 0; i < this.storeStations.length; i++) {
            if (this.storeStations[i].getBusy()) {
                return false;
            }
        }
        for (let i = 0; i < this.bneStations.length; i++) {
            if (this.bneStations[i].getBusy()) {
                return false;
            }
        }
        for (let i = 0; i < this.callRetStations.length; i++) {
            if (this.callRetStations[i].getBusy()) {
                return false;
            }
        }
        for (let i = 0; i < this.addAddiStations.length; i++) {
            if (this.addAddiStations[i].getBusy()) {
                return false;
            }
        }
        for (let i = 0; i < this.nandStations.length; i++) {
            if (this.nandStations[i].getBusy()) {
                return false;
            }
        }
        for (let i = 0; i < this.divStations.length; i++) {
            if (this.divStations[i].getBusy()) {
                return false;
            }
        }
        return true;
    }
}


export default InstructionHandler;