class RegistersClass {
    constructor() {
      this.registers = [0, 0, 0, 0, 0, 0, 0];
    }

    private registers: number[];

    private static registerNames: string[] = [
      "R0",
      "R1",
      "R2",
      "R3",
      "R4",
      "R5",
      "R6",
      "R7"
    ];

    public static getRegisterName(register: number): string {
      return this.registerNames[register];
    }

    public writeRegister(register: number, value: number): void {
      this.registers[register] = value;
      this.registers[0] = 0;
    }
  
    public readRegister(register: number): number {
      return this.registers[register];
    }
}
  
export default RegistersClass;
