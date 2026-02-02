/**
 * Micro-Operation Definitions
 * T-state level sequences for each instruction
 * NO COMPUTATION - Pure visualization of register transfers
 */

export class MicroOpDefinitions {
    constructor() {
        this.sequences = {
            MOV_R1_5: this.getMOVMicroOps(),
            ADD_R1_R2: this.getADDMicroOps(),
            SUB_R1_R2: this.getSUBMicroOps(),
            MUL_R2_R3: this.getMULMicroOps(),
            DIV_R1_R2: this.getDIVMicroOps(),
            AND_R2_R3: this.getANDMicroOps(),
            LOAD_R1_100: this.getLOADMicroOps(),
            STORE_R2_200: this.getSTOREMicroOps()
        };
    }

    getMicroOpSequence(instructionName) {
        return this.sequences[instructionName] || [];
    }

    /**
     * MOV R1, #5 - Micro-operations
     * T1: PC → MAR
     * T2: Memory → MDR, PC + 1
     * T3: MDR → IR
     * T4: Immediate value → R1
     */
    getMOVMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'MOV R1,#5' }
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
                description: 'Immediate value #5 → R1',
                steps: [
                    { type: 'transfer', from: 'IR', to: 'R1', color: 0x00ff00, duration: 1.8, label: '#5' },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 }
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

    /**
     * ADD R1, R2 - Micro-operations
     * T1-T3: Fetch instruction (same as MOV)
     * T4: R1 → ALU
     * T5: R2 → ALU
     * T6: ALU performs addition
     * T7: ALU → R1
     */
    getADDMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'ADD R1,R2' }
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
                description: 'R1 → ALU (First operand)',
                steps: [
                    { type: 'transfer', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 1' }
                ]
            },
            {
                tState: 'T6',
                description: 'R2 → ALU (Second operand)',
                steps: [
                    { type: 'transfer', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 2' }
                ]
            },
            {
                tState: 'T7',
                description: 'ALU performs addition (R1 + R2)',
                steps: [
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                tState: 'T8',
                description: 'ALU result → R1',
                steps: [
                    { type: 'transfer', from: 'ALU', to: 'R1', color: 0x00ff00, duration: 1.5, label: 'Sum' },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 }
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

    /**
     * SUB R1, R2 - Micro-operations
     */
    getSUBMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'SUB R1,R2' }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes SUB instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: 'R1 → ALU (First operand)',
                steps: [
                    { type: 'transfer', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 1' }
                ]
            },
            {
                tState: 'T6',
                description: 'R2 → ALU (Second operand)',
                steps: [
                    { type: 'transfer', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 2' }
                ]
            },
            {
                tState: 'T7',
                description: 'ALU performs subtraction (R1 - R2)',
                steps: [
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                tState: 'T8',
                description: 'ALU result → R1',
                steps: [
                    { type: 'transfer', from: 'ALU', to: 'R1', color: 0x00ff00, duration: 1.5, label: 'Difference' },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 }
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

    /**
     * MUL R2, R3 - Micro-operations
     */
    getMULMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'MUL R2,R3' }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes MUL instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: 'R2 → ALU (First operand)',
                steps: [
                    { type: 'transfer', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 1' }
                ]
            },
            {
                tState: 'T6',
                description: 'R3 → ALU (Second operand)',
                steps: [
                    { type: 'transfer', from: 'R3', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 2' }
                ]
            },
            {
                tState: 'T7',
                description: 'ALU performs multiplication (R2 × R3)',
                steps: [
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                tState: 'T8',
                description: 'ALU result → R2',
                steps: [
                    { type: 'transfer', from: 'ALU', to: 'R2', color: 0x00ff00, duration: 1.5, label: 'Product' },
                    { type: 'highlight', component: 'R2', color: 0xff0000, duration: 1.0 }
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

    /**
     * DIV R1, R2 - Micro-operations
     */
    getDIVMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'DIV R1,R2' }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes DIV instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: 'R1 → ALU (First operand)',
                steps: [
                    { type: 'transfer', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 1' }
                ]
            },
            {
                tState: 'T6',
                description: 'R2 → ALU (Second operand)',
                steps: [
                    { type: 'transfer', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 2' }
                ]
            },
            {
                tState: 'T7',
                description: 'ALU performs division (R1 ÷ R2)',
                steps: [
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                tState: 'T8',
                description: 'ALU result → R1',
                steps: [
                    { type: 'transfer', from: 'ALU', to: 'R1', color: 0x00ff00, duration: 1.5, label: 'Quotient' },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 }
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

    /**
     * AND R2, R3 - Micro-operations
     */
    getANDMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'AND R2,R3' }
                ]
            },
            {
                tState: 'T4',
                description: 'CU decodes AND instruction',
                steps: [
                    { type: 'signal', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                tState: 'T5',
                description: 'R2 → ALU (First operand)',
                steps: [
                    { type: 'transfer', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 1' }
                ]
            },
            {
                tState: 'T6',
                description: 'R3 → ALU (Second operand)',
                steps: [
                    { type: 'transfer', from: 'R3', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'Operand 2' }
                ]
            },
            {
                tState: 'T7',
                description: 'ALU performs bitwise AND (R2 AND R3)',
                steps: [
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                tState: 'T8',
                description: 'ALU result → R2',
                steps: [
                    { type: 'transfer', from: 'ALU', to: 'R2', color: 0x00ff00, duration: 1.5, label: 'Result' },
                    { type: 'highlight', component: 'R2', color: 0xff0000, duration: 1.0 }
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

    /**
     * LOAD R1, [100] - Micro-operations
     * T1-T3: Fetch instruction
     * T4: Address [100] → MAR
     * T5: Memory → MDR
     * T6: MDR → R1
     */
    getLOADMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'LOAD R1,[100]' }
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
                description: 'Memory address [100] → MAR',
                steps: [
                    { type: 'transfer', from: 'IR', to: 'MAR', color: 0x0000ff, duration: 1.5, label: 'Addr:100' }
                ]
            },
            {
                tState: 'T6',
                description: 'Memory[100] → MDR (Read data)',
                steps: [
                    { type: 'signal', from: 'MAR', to: 'Memory', color: 0xffff00, duration: 1.0 },
                    { type: 'highlight', component: 'Memory', color: 0x9900ff, duration: 1.2 },
                    { type: 'transfer', from: 'Memory', to: 'MDR', color: 0x00ff00, duration: 1.8, label: 'Data' }
                ]
            },
            {
                tState: 'T7',
                description: 'MDR → R1 (Transfer data to register)',
                steps: [
                    { type: 'transfer', from: 'MDR', to: 'R1', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 }
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

    /**
     * STORE R2, [200] - Micro-operations
     * T1-T3: Fetch instruction
     * T4: Address [200] → MAR
     * T5: R2 → MDR
     * T6: MDR → Memory[200]
     */
    getSTOREMicroOps() {
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
                    { type: 'transfer', from: 'MDR', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'STORE R2,[200]' }
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
                description: 'Memory address [200] → MAR',
                steps: [
                    { type: 'transfer', from: 'IR', to: 'MAR', color: 0x0000ff, duration: 1.5, label: 'Addr:200' }
                ]
            },
            {
                tState: 'T6',
                description: 'R2 → MDR (Prepare data for write)',
                steps: [
                    { type: 'transfer', from: 'R2', to: 'MDR', color: 0x00ff00, duration: 1.5, label: 'Data' }
                ]
            },
            {
                tState: 'T7',
                description: 'MDR → Memory[200] (Write data)',
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
}