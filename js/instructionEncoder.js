/**
 * Instruction Encoder - 16-bit Binary Encoding System
 * Converts assembly instructions to binary machine code
 * 
 * FORMAT: [Opcode:4][Reg1:2][Reg2:2][Immediate/Address:8]
 *         Bits: 15-12   11-10   9-8     7-0
 */

export class InstructionEncoder {
    constructor() {
        // Opcode table (4 bits = 16 possible opcodes)
        this.opcodes = {
            'MOV': 0b0001,   // 1
            'ADD': 0b0010,   // 2
            'SUB': 0b0011,   // 3
            'MUL': 0b0100,   // 4
            'DIV': 0b0101,   // 5
            'AND': 0b0110,   // 6
            'LOAD': 0b0111,  // 7
            'STORE': 0b1000  // 8
            // 0b1001 - 0b1111 reserved for future instructions
        };

        // Register encoding (2 bits = 4 registers)
        this.registers = {
            'R0': 0b00,  // 0
            'R1': 0b01,  // 1
            'R2': 0b10,  // 2
            'R3': 0b11   // 3
        };
    }

    /**
     * Encode an instruction to 16-bit binary
     * @param {string} type - Instruction type (MOV, ADD, etc.)
     * @param {object} params - Instruction parameters
     * @returns {object} Binary encoding details
     */
    encode(type, params) {
        const opcode = this.opcodes[type.toUpperCase()];
        
        if (opcode === undefined) {
            return this.createErrorEncoding('Invalid opcode: ' + type);
        }

        let reg1Bits = 0b00;
        let reg2Bits = 0b00;
        let immediateBits = 0b00000000;

        // Encode based on instruction type
        switch (type.toUpperCase()) {
            case 'MOV':
                // MOV R1, #5 -> Reg1=dest, Immediate=value
                reg1Bits = this.encodeRegister(params.destReg);
                immediateBits = this.encodeImmediate(params.immediate);
                break;

            case 'ADD':
            case 'SUB':
            case 'MUL':
            case 'DIV':
            case 'AND':
                // ADD R1, R2 -> Reg1=dest, Reg2=source
                reg1Bits = this.encodeRegister(params.destReg);
                reg2Bits = this.encodeRegister(params.sourceReg);
                break;

            case 'LOAD':
                // LOAD R1, [100] -> Reg1=dest, Immediate=address
                reg1Bits = this.encodeRegister(params.destReg);
                immediateBits = this.encodeImmediate(params.address);
                break;

            case 'STORE':
                // STORE R1, [100] -> Reg1=source, Immediate=address
                reg1Bits = this.encodeRegister(params.sourceReg || params.destReg);
                immediateBits = this.encodeImmediate(params.address);
                break;
        }

        // Combine into 16-bit instruction
        const binaryInstruction = (opcode << 12) | (reg1Bits << 10) | (reg2Bits << 8) | immediateBits;

        return this.formatEncoding(binaryInstruction, type, reg1Bits, reg2Bits, immediateBits, params);
    }

    /**
     * Encode register name to 2-bit value
     */
    encodeRegister(regName) {
        if (!regName) return 0b00;
        const upperReg = regName.toUpperCase();
        return this.registers[upperReg] !== undefined ? this.registers[upperReg] : 0b00;
    }

    /**
     * Encode immediate value to 8-bit value
     */
    encodeImmediate(value) {
        if (value === undefined || value === null) return 0b00000000;
        
        const numValue = parseInt(value);
        
        // Clamp to 8-bit range (0-255)
        if (numValue < 0) return 0;
        if (numValue > 255) return 255;
        
        return numValue & 0xFF;
    }

    /**
     * Format encoding result with detailed breakdown
     */
    formatEncoding(binaryInstruction, type, reg1Bits, reg2Bits, immediateBits, params) {
        const opcodeBits = (binaryInstruction >> 12) & 0xF;

        return {
            // Binary representation
            binary16: this.to16BitBinary(binaryInstruction),
            binaryFormatted: this.formatBinary(binaryInstruction),
            
            // Hexadecimal
            hex: '0x' + binaryInstruction.toString(16).toUpperCase().padStart(4, '0'),
            
            // Decimal
            decimal: binaryInstruction,
            
            // Field breakdown
            fields: {
                opcode: {
                    binary: this.to4BitBinary(opcodeBits),
                    decimal: opcodeBits,
                    name: type.toUpperCase()
                },
                reg1: {
                    binary: this.to2BitBinary(reg1Bits),
                    decimal: reg1Bits,
                    name: (params.destReg || params.sourceReg || '-').toUpperCase()
                },
                reg2: {
                    binary: this.to2BitBinary(reg2Bits),
                    decimal: reg2Bits,
                    name: params.sourceReg && params.destReg ? params.sourceReg.toUpperCase() : '-'
                },
                immediate: {
                    binary: this.to8BitBinary(immediateBits),
                    decimal: immediateBits,
                    value: immediateBits
                }
            }
        };
    }

    /**
     * Create error encoding (all zeros)
     */
    createErrorEncoding(message) {
        console.error('[Encoder]', message);
        return {
            binary16: '0000000000000000',
            binaryFormatted: '0000 0000 0000 0000',
            hex: '0x0000',
            decimal: 0,
            fields: {
                opcode: { binary: '0000', decimal: 0, name: 'ERROR' },
                reg1: { binary: '00', decimal: 0, name: '-' },
                reg2: { binary: '00', decimal: 0, name: '-' },
                immediate: { binary: '00000000', decimal: 0, value: 0 }
            }
        };
    }

    /**
     * Convert to 16-bit binary string
     */
    to16BitBinary(value) {
        return value.toString(2).padStart(16, '0');
    }

    /**
     * Convert to formatted binary (4-bit groups)
     */
    formatBinary(value) {
        const bin = this.to16BitBinary(value);
        return bin.slice(0, 4) + ' ' + bin.slice(4, 8) + ' ' + bin.slice(8, 12) + ' ' + bin.slice(12, 16);
    }

    /**
     * Helper: 4-bit binary
     */
    to4BitBinary(value) {
        return value.toString(2).padStart(4, '0');
    }

    /**
     * Helper: 2-bit binary
     */
    to2BitBinary(value) {
        return value.toString(2).padStart(2, '0');
    }

    /**
     * Helper: 8-bit binary
     */
    to8BitBinary(value) {
        return value.toString(2).padStart(8, '0');
    }

    /**
     * Decode binary instruction back to assembly (for verification)
     */
    decode(binaryValue) {
        const opcode = (binaryValue >> 12) & 0xF;
        const reg1 = (binaryValue >> 10) & 0x3;
        const reg2 = (binaryValue >> 8) & 0x3;
        const immediate = binaryValue & 0xFF;

        // Find opcode name
        const opcodeName = Object.keys(this.opcodes).find(key => this.opcodes[key] === opcode) || 'UNKNOWN';
        
        // Find register names
        const reg1Name = Object.keys(this.registers).find(key => this.registers[key] === reg1);
        const reg2Name = Object.keys(this.registers).find(key => this.registers[key] === reg2);

        return {
            opcode: opcodeName,
            reg1: reg1Name,
            reg2: reg2Name,
            immediate: immediate
        };
    }
}
