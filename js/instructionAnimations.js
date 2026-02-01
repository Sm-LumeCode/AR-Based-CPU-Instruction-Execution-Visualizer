/**
 * Instruction Animation Definitions - SLOWER FOR BETTER UNDERSTANDING
 * Duration increased by 2x for better visual comprehension
 */

export class InstructionAnimations {
    constructor() {
        this.sequences = {
            MOV_R1_5: this.getMOVSequence(),
            ADD_R1_R2: this.getADDSequence(),
            LOAD_R1_100: this.getLOADSequence(),
            STORE_R2_200: this.getSTORESequence(),
            SUB_R3_R1: this.getSUBSequence(),
            MUL_R2_R3: this.getMULSequence()
        };
    }

    getSequence(instructionName) {
        return this.sequences[instructionName] || [];
    }

    getMOVSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'CPU fetches the MOV instruction from memory',
                explanation: 'PC sends address → Memory returns instruction → Stored in IR',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'Memory', color: 0x0000ff, duration: 1.5, label: 'Address' },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'IR', color: 0x00ff00, duration: 1.5, label: 'Instruction' },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: 'Control Unit decodes: "Move immediate value 5 to R1"',
                explanation: 'IR tells CU what operation to perform',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'Moving immediate value #5 into Register R1',
                explanation: 'No ALU needed - direct data transfer from instruction to register',
                steps: [
                    { type: 'dataToken', from: 'IR', to: 'R1', color: 0x00ff00, duration: 1.8, label: 'Value: 5' },
                    { type: 'highlight', component: 'R1', color: 0x00ff00, duration: 1.2 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Value 5 is now stored in R1',
                explanation: 'R1 now contains the value 5',
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
                description: 'CPU fetches the ADD instruction from memory',
                explanation: 'PC → Memory → IR (standard instruction fetch)',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'Memory', color: 0x0000ff, duration: 1.5 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'IR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: 'Control Unit decodes: "Add R1 and R2, store result in R1"',
                explanation: 'CU prepares ALU for addition operation',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU adds the values from R1 and R2',
                explanation: 'R1 value + R2 value → ALU performs addition',
                steps: [
                    { type: 'highlight', component: 'R1', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'R1 value' },
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'R2 value' },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Result is written back to R1',
                explanation: 'ALU result → R1 (R1 now contains R1 + R2)',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R1', color: 0x00ff00, duration: 1.5, label: 'Sum' },
                    { type: 'highlight', component: 'R1', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getLOADSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'CPU fetches the LOAD instruction',
                explanation: 'Getting the instruction from memory',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'Memory', color: 0x0000ff, duration: 1.5 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'IR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: 'Control Unit decodes: "Load from memory address 100 into R1"',
                explanation: 'CU understands we need to read from memory',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'MEMORY ACCESS',
                description: 'Reading data from memory location [100]',
                explanation: 'Memory sends the data stored at address 100',
                steps: [
                    { type: 'highlight', component: 'Memory', color: 0x9900ff, duration: 1.2 },
                    { type: 'dataToken', from: 'Memory', to: 'R1', color: 0x00ff00, duration: 2.0, label: 'Data from [100]' }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Data from memory[100] is now in R1',
                explanation: 'R1 contains the value that was in memory address 100',
                steps: [
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
                description: 'CPU fetches the STORE instruction',
                explanation: 'Reading instruction from memory',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'Memory', color: 0x0000ff, duration: 1.5 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'IR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: 'Control Unit decodes: "Store R2 value into memory address 200"',
                explanation: 'CU prepares to write to memory',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'MEMORY ACCESS',
                description: 'Writing R2 value to memory location [200]',
                explanation: 'R2 data travels to memory and is stored at address 200',
                steps: [
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'Memory', color: 0x00ff00, duration: 2.0, label: 'R2 → [200]' },
                    { type: 'highlight', component: 'Memory', color: 0xff0000, duration: 1.2 }
                ]
            },
            {
                stage: 'COMPLETE',
                description: 'R2 value successfully stored in memory[200]',
                explanation: 'Memory location 200 now contains R2 value',
                steps: [
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getSUBSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'CPU fetches the SUB instruction',
                explanation: 'Standard instruction fetch cycle',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'Memory', color: 0x0000ff, duration: 1.5 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'IR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: 'Control Unit decodes: "Subtract R1 from R3, store in R3"',
                explanation: 'CU prepares ALU for subtraction (R3 - R1)',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU subtracts R1 from R3',
                explanation: 'R3 value - R1 value → ALU calculates difference',
                steps: [
                    { type: 'highlight', component: 'R3', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R3', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'R3' },
                    { type: 'highlight', component: 'R1', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R1', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'R1' },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.0 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Result (R3 - R1) written back to R3',
                explanation: 'R3 now contains the difference',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R3', color: 0x00ff00, duration: 1.5, label: 'Result' },
                    { type: 'highlight', component: 'R3', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }

    getMULSequence() {
        return [
            {
                stage: 'FETCH',
                description: 'CPU fetches the MUL instruction',
                explanation: 'Getting multiplication instruction from memory',
                steps: [
                    { type: 'highlight', component: 'PC', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'PC', to: 'Memory', color: 0x0000ff, duration: 1.5 },
                    { type: 'highlight', component: 'Memory', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'Memory', to: 'IR', color: 0x00ff00, duration: 1.5 },
                    { type: 'highlight', component: 'IR', color: 0x00ffff, duration: 1.0 }
                ]
            },
            {
                stage: 'DECODE',
                description: 'Control Unit decodes: "Multiply R2 and R3, store in R2"',
                explanation: 'CU prepares ALU for multiplication',
                steps: [
                    { type: 'glowingWire', from: 'IR', to: 'CU', color: 0xffff00, duration: 1.2 },
                    { type: 'highlight', component: 'CU', color: 0xffff00, duration: 1.5 }
                ]
            },
            {
                stage: 'EXECUTE',
                description: 'ALU multiplies R2 × R3',
                explanation: 'R2 value × R3 value → ALU performs multiplication',
                steps: [
                    { type: 'highlight', component: 'R2', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R2', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'R2' },
                    { type: 'highlight', component: 'R3', color: 0x00ffff, duration: 1.0 },
                    { type: 'dataToken', from: 'R3', to: 'ALU', color: 0x00ff00, duration: 1.5, label: 'R3' },
                    { type: 'highlight', component: 'ALU', color: 0xff0000, duration: 2.5 }
                ]
            },
            {
                stage: 'WRITE-BACK',
                description: 'Product (R2 × R3) written back to R2',
                explanation: 'R2 now contains the multiplication result',
                steps: [
                    { type: 'dataToken', from: 'ALU', to: 'R2', color: 0x00ff00, duration: 1.5, label: 'Product' },
                    { type: 'highlight', component: 'R2', color: 0xff0000, duration: 1.0 },
                    { type: 'reset', component: 'all' }
                ]
            }
        ];
    }
}