/**
 * Instruction Definitions for Instruction Cycle Mode
 * High-level stage-based animations
 */

export class InstructionDefinitions {
    constructor() {
        this.sequences = {
            MOV_R1_5: this.getMOVSequence(),
            ADD_R1_R2: this.getADDSequence(),
            SUB_R1_R2: this.getSUBSequence(),
            MUL_R2_R3: this.getMULSequence(),
            DIV_R1_R2: this.getDIVSequence(),
            AND_R2_R3: this.getANDSequence(),
            LOAD_R1_100: this.getLOADSequence(),
            STORE_R2_200: this.getSTORESequence()
        };
    }

    getInstructionCycleSequence(instructionName) {
        return this.sequences[instructionName] || [];
    }

    getMOVSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'Fetching MOV instruction from memory',
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
                description: 'Control Unit decodes: Move immediate value 5 to R1',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'Moving immediate value #5 into Register R1',
                steps: [
                    { type: 'dataToken', from: 'IR', to: 'R1', color: 0x00ff00, duration: 1.8, label: '#5' },
                    { type: 'highlight', component: 'R1', color: 0x00ff00, duration: 1.2 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Value 5 now stored in R1',
                steps: [
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getADDSequence() {
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
                description: 'Control Unit decodes: Add R1 and R2, store in R1',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU adds R1 and R2 values',
                steps: [
                    { type: 'highlight', component: 'R1', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Result written back to R1',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R1', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getSUBSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'Fetching SUB instruction from memory',
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
                description: 'Control Unit decodes: Subtract R2 from R1, store in R1',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU subtracts R2 from R1 values',
                steps: [
                    { type: 'highlight', component: 'R1', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Result written back to R1',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R1', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getMULSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'Fetching MUL instruction from memory',
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
                description: 'Control Unit decodes: Multiply R2 and R3, store in R2',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU multiplies R2 and R3 values',
                steps: [
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R3', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R3', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Result written back to R2',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R2', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R2', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getDIVSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'Fetching DIV instruction from memory',
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
                description: 'Control Unit decodes: Divide R1 by R2, store in R1',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU divides R1 by R2 values',
                steps: [
                    { type: 'highlight', component: 'R1', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Result written back to R1',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R1', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getANDSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'Fetching AND instruction from memory',
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
                description: 'Control Unit decodes: Bitwise AND R2 and R3, store in R2',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU performs bitwise AND on R2 and R3 values',
                steps: [
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R3', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R3', to: 'ALU', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Result written back to R2',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R2', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R2', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getLOADSequence() {
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
                description: 'Control Unit decodes: Load from memory[100] to R1',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'MEMORY ACCESS',
                description: 'Reading data from memory location [100]',
                steps: [
                    { type: 'highlight', component: 'MAR', color: 0x00ffff, duration: 0.8 },
                    { type: 'highlight', component: 'Memory', color: 0x9900ff, duration: 1.2 },
                    { type: 'dataToken', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.5, label: '[100]' },
                    { type: 'highlight', component: 'MDR', color: 0x00ffff, duration: 0.8 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Data transferred to R1',
                steps: [
                    { type: 'dataToken', from: 'MDR', to: 'R1', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getSTORESequence() {
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
                description: 'Control Unit decodes: Store R2 to memory[200]',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'MEMORY ACCESS',
                description: 'Writing R2 value to memory[200]',
                steps: [
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'MDR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'MDR', color: 0x00ffff, duration: 0.8 },
                    { type: 'dataToken', from: 'MDR', to: 'Memory', color: 0x00ff00, duration: 1.5, label: '→[200]' },
                    { type: 'highlight', component: 'Memory', color: 0xff0000, duration: 1.2 }
                ]
            },
            {
                stage: 'COMPLETE',
                description: 'R2 value stored in memory[200]',
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }
}