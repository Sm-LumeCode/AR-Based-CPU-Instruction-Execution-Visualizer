/**
 * Template Instruction Generator
 * Maps parsed user input to predefined animation sequences
 * NO COMPUTATION - Only parameter substitution in labels
 */

export class TemplateInstructionGenerator {
    constructor(instructionDefinitions, microOpDefinitions) {
        this.instructionDefs = instructionDefinitions;
        this.microOpDefs = microOpDefinitions;
    }

    /**
     * Generate instruction sequence from parsed instruction
     * Reuses EXISTING sequences with parameter substitution
     */
    generateInstructionCycleSequence(parsedInstruction) {
        const { type, params } = parsedInstruction;

        switch (type) {
            case 'MOV':
                return this.generateMOVSequence(params);
            case 'ADD':
                return this.generateADDSequence(params);
            case 'SUB':
                return this.generateSUBSequence(params);
            case 'MUL':
                return this.generateMULSequence(params);
            case 'DIV':
                return this.generateDIVSequence(params);
            case 'AND':
                return this.generateANDSequence(params);
            case 'LOAD':
                return this.generateLOADSequence(params);
            case 'STORE':
                return this.generateSTORESequence(params);
            default:
                return [];
        }
    }

    /**
     * Generate micro-operation sequence from parsed instruction
     */
    generateMicroOpSequence(parsedInstruction) {
        const { type, params } = parsedInstruction;

        switch (type) {
            case 'MOV':
                return this.generateMOVMicroOps(params);
            case 'ADD':
                return this.generateADDMicroOps(params);
            case 'SUB':
                return this.generateSUBMicroOps(params);
            case 'MUL':
                return this.generateMULMicroOps(params);
            case 'DIV':
                return this.generateDIVMicroOps(params);
            case 'AND':
                return this.generateANDMicroOps(params);
            case 'LOAD':
                return this.generateLOADMicroOps(params);
            case 'STORE':
                return this.generateSTOREMicroOps(params);
            default:
                return [];
        }
    }

    // ===== INSTRUCTION CYCLE SEQUENCES =====

    generateMOVSequence(params) {
        const { destReg, immediate } = params;
        
        return [
            {
                stage: 'FETCH',
                description: `Fetching MOV instruction from memory`,
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.2 },
                    { type: 'highlight', component: 'MAR', color: 0x00ffff, duration: 0.8 },
                    { type: 'dataToken', from: 'MAR', to: 'Memory', color: 0x0000ff, duration: 1.2 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.2 },
                    { type: 'highlight', component: 'MDR', color: 0x00ffff, duration: 0.8 },
                    { type: 'dataToken', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.2 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: `Control Unit decodes: Move immediate value ${immediate} to ${destReg}`,
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: `Moving immediate value #${immediate} into Register ${destReg}`,
                steps: [
                    { type: 'dataToken', from: 'IR', to: destReg, color: 0x00ff00, duration: 1.8, label: `#${immediate}` },
                    { type: 'highlight', component: destReg, color: 0x00ff00, duration: 1.2 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: `Value ${immediate} now stored in ${destReg}`,
                steps: [
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    generateADDSequence(params) {
        const { destReg, sourceReg } = params;
        
        return [
            {
                stage: 'FETCH',
                description: 'Fetching ADD instruction from memory',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.2 },
                    { type: 'dataToken', from: 'MAR', to: 'Memory', color: 0x0000ff, duration: 1.2 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.2 },
                    { type: 'dataToken', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.2 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: `Control Unit decodes: Add ${destReg} and ${sourceReg}, store in ${destReg}`,
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: `ALU adds ${destReg} and ${sourceReg} values`,
                steps: [
                    { type: 'highlight', component: destReg, color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: destReg, to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: sourceReg, color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: sourceReg, to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: `Result written back to ${destReg}`,
                steps: [
                    { type: 'dataToken', from: 'ALU', to: destReg, color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    generateLOADSequence(params) {
        const { destReg, address } = params;
        
        return [
            {
                stage: 'FETCH',
                description: 'Fetching LOAD instruction',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.2 },
                    { type: 'dataToken', from: 'MAR', to: 'Memory', color: 0x0000ff, duration: 1.2 },
                    { type: 'dataToken', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.2 },
                    { type: 'dataToken', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.2 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: `Control Unit decodes: Load from memory[${address}] to ${destReg}`,
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'MEMORY ACCESS',
                description: `Reading data from memory location [${address}]`,
                steps: [
                    { type: 'highlight', component: 'MAR', color: 0x00ffff, duration: 0.8 },
                    { type: 'highlight', component: 'Memory', color: 0x9900ff, duration: 1.2 },
                    { type: 'dataToken', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.5, label: `[${address}]` },
                    { type: 'highlight', component: 'MDR', color: 0x00ffff, duration: 0.8 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: `Data transferred to ${destReg}`,
                steps: [
                    { type: 'dataToken', from: 'MDR', to: destReg, color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    generateSTORESequence(params) {
        const { sourceReg, address } = params;
        
        return [
            {
                stage: 'FETCH',
                description: 'Fetching STORE instruction',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.2 },
                    { type: 'dataToken', from: 'MAR', to: 'Memory', color: 0x0000ff, duration: 1.2 },
                    { type: 'dataToken', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.2 },
                    { type: 'dataToken', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.2 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: `Control Unit decodes: Store ${sourceReg} to memory[${address}]`,
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'MEMORY ACCESS',
                description: `Writing ${sourceReg} value to memory[${address}]`,
                steps: [
                    { type: 'highlight', component: sourceReg, color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: sourceReg, to: 'MDR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'MDR', color: 0x00ffff, duration: 0.8 },
                    { type: 'dataToken', from: 'MDR', to: 'Memory', color: 0x00ff00, duration: 1.5, label: `→[${address}]` },
                    { type: 'highlight', component: 'Memory', color: 0xff0000, duration: 1.2 }
                ]
            },
            {
                stage: 'COMPLETE',
                description: `${sourceReg} value stored in memory[${address}]`,
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    // ===== MICRO-OPERATION SEQUENCES =====

    generateMOVMicroOps(params) {
        const { destReg, immediate } = params;
        
        return [
            {
                tState: 'T1',
                description: 'PC → MAR (Transfer address to MAR)',
                steps: [
                    { type: 'transfer', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.5, label: 'Address' }
                ]
            },
            {
                tState: 'T2',
                description: 'Memory → MDR (Fetch instruction), PC + 1',
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'transfer', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.5, label: 'Instruction' },
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 0.8 }
                ]
            },
            {
                tState: 'T3',
                description: 'MDR → IR (Load instruction into IR)',
                steps: [
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: `MOV ${destReg},#${immediate}` }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: `Immediate value #${immediate} → ${destReg}`,
                steps: [
                    { type: 'transfer', from: 'IR', to: destReg, color: 0x00ff00, duration: 1.8, label: `#${immediate}` },
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 }
                ]
            },
            {
                tState: 'COMPLETE',
                description: 'Instruction execution complete',
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    generateADDMicroOps(params) {
        const { destReg, sourceReg } = params;
        
        return [
            {
                tState: 'T1',
                description: 'PC → MAR',
                steps: [
                    { type: 'transfer', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.5 }
                ]
            },
            {
                tState: 'T2',
                description: 'Memory → MDR, PC + 1',
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'transfer', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 0.8 }
                ]
            },
            {
                tState: 'T3',
                description: 'MDR → IR',
                steps: [
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: `ADD ${destReg},${sourceReg}` }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes ADD instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: `${destReg} → ALU (First operand)`,
                steps: [
                    { type: 'transfer', from: destReg, to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 1' }
                ]
            },
            {
                tState: 'T6',
                description: `${sourceReg} → ALU (Second operand)`,
                steps: [
                    { type: 'transfer', from: sourceReg, to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 2' }
                ]
            },
            {
                tState: 'T7',
                description: `ALU performs addition (${destReg} + ${sourceReg})`,
                steps: [
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                tState: 'T8',
                description: `ALU result → ${destReg}`,
                steps: [
                    { type: 'transfer', from: 'ALU', to: destReg, color: 0x00ff00, duration: 1.5, label: 'Sum' },
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 }
                ]
            },
            {
                tState: 'COMPLETE',
                description: 'Instruction execution complete',
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    generateLOADMicroOps(params) {
        const { destReg, address } = params;
        
        return [
            {
                tState: 'T1',
                description: 'PC → MAR',
                steps: [
                    { type: 'transfer', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.5 }
                ]
            },
            {
                tState: 'T2',
                description: 'Memory → MDR, PC + 1',
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'transfer', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 0.8 }
                ]
            },
            {
                tState: 'T3',
                description: 'MDR → IR',
                steps: [
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: `LOAD ${destReg},[${address}]` }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes LOAD instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: `Memory address [${address}] → MAR`,
                steps: [
                    { type: 'transfer', from: 'IR', to: 'MAR', color: 0x0000ff, duration: 1.5, label: `Addr:${address}` }
                ]
            },
            {
                tState: 'T6',
                description: `Memory[${address}] → MDR (Read data)`,
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'highlight', component: 'Memory', color: 0x9900ff, duration: 1.2 },
                    { type: 'transfer', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.8, label: 'Data' }
                ]
            },
            {
                tState: 'T7',
                description: `MDR → ${destReg} (Transfer data to register)`,
                steps: [
                    { type: 'transfer', from: 'MDR', to: destReg, color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 }
                ]
            },
            {
                tState: 'COMPLETE',
                description: 'Instruction execution complete',
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    generateSTOREMicroOps(params) {
        const { sourceReg, address } = params;
        
        return [
            {
                tState: 'T1',
                description: 'PC → MAR',
                steps: [
                    { type: 'transfer', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.5 }
                ]
            },
            {
                tState: 'T2',
                description: 'Memory → MDR, PC + 1',
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'transfer', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 0.8 }
                ]
            },
            {
                tState: 'T3',
                description: 'MDR → IR',
                steps: [
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: `STORE ${sourceReg},[${address}]` }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes STORE instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: `Memory address [${address}] → MAR`,
                steps: [
                    { type: 'transfer', from: 'IR', to: 'MAR', color: 0x0000ff, duration: 1.5, label: `Addr:${address}` }
                ]
            },
            {
                tState: 'T6',
                description: `${sourceReg} → MDR (Prepare data for write)`,
                steps: [
                    { type: 'transfer', from: sourceReg, to: 'MDR', color: 0x00ff00, duration: 1.5, label: 'Data' }
                ]
            },
            {
                tState: 'T7',
                description: `MDR → Memory[${address}] (Write data)`,
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'transfer', from: 'MDR', to: 'Memory', color: 0x00ff00, duration: 1.8 },
                    { type: 'highlight', component: 'Memory', color: 0xff0000, duration: 1.2 }
                ]
            },
            {
                tState: 'COMPLETE',
                description: 'Instruction execution complete',
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    // ===== NEW ARITHMETIC/LOGIC INSTRUCTIONS =====

    generateSUBSequence(params) {
        return this.generateALUSequence(params, 'SUB', 'Subtract', 'subtraction');
    }

    generateMULSequence(params) {
        return this.generateALUSequence(params, 'MUL', 'Multiply', 'multiplication');
    }

    generateDIVSequence(params) {
        return this.generateALUSequence(params, 'DIV', 'Divide', 'division');
    }

    generateANDSequence(params) {
        return this.generateALUSequence(params, 'AND', 'Bitwise AND', 'AND operation');
    }

    /**
     * Generic ALU operation sequence generator
     * Used for SUB, MUL, DIV, AND (same pattern as ADD)
     */
    generateALUSequence(params, opcode, operation, operationName) {
        const { destReg, sourceReg } = params;
        
        return [
            {
                stage: 'FETCH',
                description: `Fetching ${opcode} instruction from memory`,
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.2 },
                    { type: 'dataToken', from: 'MAR', to: 'Memory', color: 0x0000ff, duration: 1.2 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.2 },
                    { type: 'dataToken', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.2 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: `Control Unit decodes: ${operation} ${destReg} and ${sourceReg}, store in ${destReg}`,
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: `ALU performs ${operationName} on ${destReg} and ${sourceReg} values`,
                steps: [
                    { type: 'highlight', component: destReg, color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: destReg, to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: sourceReg, color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: sourceReg, to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: `Result written back to ${destReg}`,
                steps: [
                    { type: 'dataToken', from: 'ALU', to: destReg, color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    // ===== NEW MICRO-OPERATIONS =====

    generateSUBMicroOps(params) {
        return this.generateALUMicroOps(params, 'SUB', 'subtraction');
    }

    generateMULMicroOps(params) {
        return this.generateALUMicroOps(params, 'MUL', 'multiplication');
    }

    generateDIVMicroOps(params) {
        return this.generateALUMicroOps(params, 'DIV', 'division');
    }

    generateANDMicroOps(params) {
        return this.generateALUMicroOps(params, 'AND', 'AND operation');
    }

    /**
     * Generic ALU micro-operation sequence generator
     * Used for SUB, MUL, DIV, AND (same pattern as ADD)
     */
    generateALUMicroOps(params, opcode, operationName) {
        const { destReg, sourceReg } = params;
        
        return [
            {
                tState: 'T1',
                description: 'PC → MAR',
                steps: [
                    { type: 'transfer', from: 'PC', to: 'MAR', color: 0x0000ff, duration: 1.5 }
                ]
            },
            {
                tState: 'T2',
                description: 'Memory → MDR, PC + 1',
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'transfer', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 0.8 }
                ]
            },
            {
                tState: 'T3',
                description: 'MDR → IR',
                steps: [
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: `${opcode} ${destReg},${sourceReg}` }
                ]
            },
            {
                tState: 'T4',
                description: `CU decodes ${opcode} instruction`,
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: `${destReg} → ALU (First operand)`,
                steps: [
                    { type: 'transfer', from: destReg, to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 1' }
                ]
            },
            {
                tState: 'T6',
                description: `${sourceReg} → ALU (Second operand)`,
                steps: [
                    { type: 'transfer', from: sourceReg, to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 2' }
                ]
            },
            {
                tState: 'T7',
                description: `ALU performs ${operationName} (${destReg} ${opcode} ${sourceReg})`,
                steps: [
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                tState: 'T8',
                description: `ALU result → ${destReg}`,
                steps: [
                    { type: 'transfer', from: 'ALU', to: destReg, color: 0x00ff00, duration: 1.5, label: 'Result' },
                    { type: 'highlight', component: destReg, color: 0xff0000, duration: 1.0 }
                ]
            },
            {
                tState: 'COMPLETE',
                description: 'Instruction execution complete',
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }
}

