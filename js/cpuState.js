/**
 * CPU Login State Module
 * Separates logical state from visualization
 */

export class CPUState {
    constructor() {
        this.registers = {
            'R0': 0,
            'R1': 0,
            'R2': 0,
            'R3': 0
        };
        // Simple memory storage (Address -> Value)
        this.memory = {};
    }

    getMemory(address) {
        // Default any address to 0 if not set
        return this.memory[address] || 0;
    }

    setMemory(address, value) {
        this.memory[address] = parseInt(value);
        console.log(`[CPU State] Memory at [${address}] updated to ${this.memory[address]}`);
    }

    getRegister(name) {
        return this.registers[name] || 0;
    }

    setRegister(name, value) {
        if (this.registers.hasOwnProperty(name)) {
            this.registers[name] = parseInt(value);
            console.log(`[CPU State] ${name} updated to ${this.registers[name]}`);
        } else {
            console.warn(`[CPU State] Invalid register: ${name}`);
        }
    }

    /**
     * Execute instruction and update state
     * @param {string} instructionName - Opcode (MOV, ADD) or Button ID (MOV_R1_5)
     * @param {object} operands - { destReg, sourceReg, immediate, address }
     */
    executeInstruction(instructionName, operands = {}) {
        // Handle button ID strings (Legacy support)
        if (instructionName.includes('_')) {
            this.handleLegacyInstruction(instructionName);
            return;
        }

        const op = instructionName.toUpperCase();

        switch (op) {
            case 'MOV':
                if (operands.destReg && operands.immediate !== undefined) {
                    this.setRegister(operands.destReg, operands.immediate);
                }
                break;

            case 'ADD':
                this.handleALU(operands.destReg, operands.sourceReg, (a, b) => a + b);
                break;

            case 'SUB':
                this.handleALU(operands.destReg, operands.sourceReg, (a, b) => a - b);
                break;

            case 'MUL':
                this.handleALU(operands.destReg, operands.sourceReg, (a, b) => a * b);
                break;

            case 'DIV':
                this.handleALU(operands.destReg, operands.sourceReg, (a, b) => Math.floor(a / b));
                break;

            case 'AND':
                this.handleALU(operands.destReg, operands.sourceReg, (a, b) => a & b);
                break;

            case 'LOAD':
                if (operands.destReg && operands.address !== undefined) {
                    const value = this.getMemory(operands.address);
                    this.setRegister(operands.destReg, value);
                }
                break;

            case 'STORE':
                if (operands.sourceReg && operands.address !== undefined) {
                    const value = this.getRegister(operands.sourceReg);
                    this.setMemory(operands.address, value);
                }
                break;
        }
    }

    handleALU(destReg, sourceReg, operation) {
        if (!destReg || !sourceReg) return;

        const val1 = this.getRegister(destReg);
        const val2 = this.getRegister(sourceReg);

        const result = operation(val1, val2);
        this.setRegister(destReg, result);
    }

    handleLegacyInstruction(instructionName) {
        // Simple mapping for the buttons
        const parts = instructionName.split('_');
        const op = parts[0].toUpperCase();

        if (op === 'MOV') {
            // MOV_R1_5 -> R1 = 5
            const reg = parts[1];
            const val = parseInt(parts[2]);
            this.setRegister(reg, val);
        } else if (['ADD', 'SUB', 'MUL', 'DIV', 'AND'].includes(op)) {
            // ADD_R1_R2 -> R1 = R1 + R2
            const dest = parts[1];
            const src = parts[2];
            this.executeInstruction(op, { destReg: dest, sourceReg: src });
        } else if (op === 'LOAD') {
            // LOAD_R1_100 -> R1 = Memory[100]
            const dest = parts[1];
            const addr = parts[2];
            this.executeInstruction(op, { destReg: dest, address: addr });
        } else if (op === 'STORE') {
            // STORE_R2_200 -> Memory[200] = R2
            const src = parts[1];
            const addr = parts[2];
            this.executeInstruction(op, { sourceReg: src, address: addr });
        }
    }
}
