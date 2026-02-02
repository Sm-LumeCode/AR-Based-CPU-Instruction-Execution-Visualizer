/**
 * Instruction Parser - TEMPLATE-BASED VALIDATION ONLY
 * NO COMPUTATION, NO DECODING, NO EXECUTION
 * Pure pattern matching to existing animation sequences
 * NOW SUPPORTS: MOV, ADD, SUB, MUL, DIV, AND, LOAD, STORE
 */

export class InstructionParser {
    constructor() {
        // Valid registers only
        this.validRegisters = ['R0', 'R1', 'R2', 'R3'];
        
        // Template patterns (case-insensitive)
        this.patterns = {
            MOV: /^\s*MOV\s+(R[0-3])\s*,\s*#(\d+)\s*$/i,
            ADD: /^\s*ADD\s+(R[0-3])\s*,\s*(R[0-3])\s*$/i,
            SUB: /^\s*SUB\s+(R[0-3])\s*,\s*(R[0-3])\s*$/i,
            MUL: /^\s*MUL\s+(R[0-3])\s*,\s*(R[0-3])\s*$/i,
            DIV: /^\s*DIV\s+(R[0-3])\s*,\s*(R[0-3])\s*$/i,
            AND: /^\s*AND\s+(R[0-3])\s*,\s*(R[0-3])\s*$/i,
            LOAD: /^\s*LOAD\s+(R[0-3])\s*,\s*\[(\d+)\]\s*$/i,
            STORE: /^\s*STORE\s+(R[0-3])\s*,\s*\[(\d+)\]\s*$/i
        };
    }

    /**
     * Parse user input and return instruction descriptor
     * Returns: { valid: bool, type: string, params: object, error: string, displayName: string }
     */
    parse(input) {
        // Trim whitespace
        const trimmed = input.trim();
        
        // Empty check
        if (!trimmed) {
            return {
                valid: false,
                error: 'Please enter an instruction',
                displayName: ''
            };
        }

        // Try MOV pattern
        const movMatch = trimmed.match(this.patterns.MOV);
        if (movMatch) {
            return {
                valid: true,
                type: 'MOV',
                params: {
                    destReg: movMatch[1].toUpperCase(),
                    immediate: movMatch[2]
                },
                displayName: `MOV ${movMatch[1].toUpperCase()}, #${movMatch[2]}`,
                instructionKey: 'MOV_TEMPLATE'
            };
        }

        // Try ADD pattern
        const addMatch = trimmed.match(this.patterns.ADD);
        if (addMatch) {
            return {
                valid: true,
                type: 'ADD',
                params: {
                    destReg: addMatch[1].toUpperCase(),
                    sourceReg: addMatch[2].toUpperCase()
                },
                displayName: `ADD ${addMatch[1].toUpperCase()}, ${addMatch[2].toUpperCase()}`,
                instructionKey: 'ADD_TEMPLATE'
            };
        }

        // Try SUB pattern
        const subMatch = trimmed.match(this.patterns.SUB);
        if (subMatch) {
            return {
                valid: true,
                type: 'SUB',
                params: {
                    destReg: subMatch[1].toUpperCase(),
                    sourceReg: subMatch[2].toUpperCase()
                },
                displayName: `SUB ${subMatch[1].toUpperCase()}, ${subMatch[2].toUpperCase()}`,
                instructionKey: 'SUB_TEMPLATE'
            };
        }

        // Try MUL pattern
        const mulMatch = trimmed.match(this.patterns.MUL);
        if (mulMatch) {
            return {
                valid: true,
                type: 'MUL',
                params: {
                    destReg: mulMatch[1].toUpperCase(),
                    sourceReg: mulMatch[2].toUpperCase()
                },
                displayName: `MUL ${mulMatch[1].toUpperCase()}, ${mulMatch[2].toUpperCase()}`,
                instructionKey: 'MUL_TEMPLATE'
            };
        }

        // Try DIV pattern
        const divMatch = trimmed.match(this.patterns.DIV);
        if (divMatch) {
            return {
                valid: true,
                type: 'DIV',
                params: {
                    destReg: divMatch[1].toUpperCase(),
                    sourceReg: divMatch[2].toUpperCase()
                },
                displayName: `DIV ${divMatch[1].toUpperCase()}, ${divMatch[2].toUpperCase()}`,
                instructionKey: 'DIV_TEMPLATE'
            };
        }

        // Try AND pattern
        const andMatch = trimmed.match(this.patterns.AND);
        if (andMatch) {
            return {
                valid: true,
                type: 'AND',
                params: {
                    destReg: andMatch[1].toUpperCase(),
                    sourceReg: andMatch[2].toUpperCase()
                },
                displayName: `AND ${andMatch[1].toUpperCase()}, ${andMatch[2].toUpperCase()}`,
                instructionKey: 'AND_TEMPLATE'
            };
        }

        // Try LOAD pattern
        const loadMatch = trimmed.match(this.patterns.LOAD);
        if (loadMatch) {
            return {
                valid: true,
                type: 'LOAD',
                params: {
                    destReg: loadMatch[1].toUpperCase(),
                    address: loadMatch[2]
                },
                displayName: `LOAD ${loadMatch[1].toUpperCase()}, [${loadMatch[2]}]`,
                instructionKey: 'LOAD_TEMPLATE'
            };
        }

        // Try STORE pattern
        const storeMatch = trimmed.match(this.patterns.STORE);
        if (storeMatch) {
            return {
                valid: true,
                type: 'STORE',
                params: {
                    sourceReg: storeMatch[1].toUpperCase(),
                    address: storeMatch[2]
                },
                displayName: `STORE ${storeMatch[1].toUpperCase()}, [${storeMatch[2]}]`,
                instructionKey: 'STORE_TEMPLATE'
            };
        }

        // No match - provide helpful error
        return {
            valid: false,
            error: this.getHelpfulError(trimmed),
            displayName: ''
        };
    }

    /**
     * Generate helpful error message based on input
     */
    getHelpfulError(input) {
        const upperInput = input.toUpperCase();
        
        // Check for instruction type
        if (upperInput.startsWith('MOV')) {
            return 'MOV format: MOV R?, #? (Example: MOV R1, #5)';
        }
        if (upperInput.startsWith('ADD')) {
            return 'ADD format: ADD R?, R? (Example: ADD R1, R2)';
        }
        if (upperInput.startsWith('SUB')) {
            return 'SUB format: SUB R?, R? (Example: SUB R1, R2)';
        }
        if (upperInput.startsWith('MUL')) {
            return 'MUL format: MUL R?, R? (Example: MUL R1, R2)';
        }
        if (upperInput.startsWith('DIV')) {
            return 'DIV format: DIV R?, R? (Example: DIV R1, R2)';
        }
        if (upperInput.startsWith('AND')) {
            return 'AND format: AND R?, R? (Example: AND R1, R2)';
        }
        if (upperInput.startsWith('LOAD')) {
            return 'LOAD format: LOAD R?, [?] (Example: LOAD R1, [100])';
        }
        if (upperInput.startsWith('STORE')) {
            return 'STORE format: STORE R?, [?] (Example: STORE R2, [200])';
        }
        
        // Unknown instruction
        return 'Supported: MOV, ADD, SUB, MUL, DIV, AND, LOAD, STORE';
    }

    /**
     * Get example instructions for help
     */
    getExamples() {
        return [
            { template: 'MOV R?, #?', example: 'MOV R1, #5', description: 'Move immediate to register' },
            { template: 'ADD R?, R?', example: 'ADD R1, R2', description: 'Add two registers' },
            { template: 'SUB R?, R?', example: 'SUB R1, R2', description: 'Subtract registers' },
            { template: 'MUL R?, R?', example: 'MUL R1, R2', description: 'Multiply registers' },
            { template: 'DIV R?, R?', example: 'DIV R1, R2', description: 'Divide registers' },
            { template: 'AND R?, R?', example: 'AND R1, R2', description: 'Bitwise AND registers' },
            { template: 'LOAD R?, [?]', example: 'LOAD R1, [100]', description: 'Load from memory' },
            { template: 'STORE R?, [?]', example: 'STORE R2, [200]', description: 'Store to memory' }
        ];
    }

    /**
     * Validate register name
     */
    isValidRegister(reg) {
        return this.validRegisters.includes(reg.toUpperCase());
    }

    /**
     * Get formatted template hints
     */
    getTemplateHints() {
        return {
            MOV: 'MOV R{0-3}, #{number}',
            ADD: 'ADD R{0-3}, R{0-3}',
            SUB: 'SUB R{0-3}, R{0-3}',
            MUL: 'MUL R{0-3}, R{0-3}',
            DIV: 'DIV R{0-3}, R{0-3}',
            AND: 'AND R{0-3}, R{0-3}',
            LOAD: 'LOAD R{0-3}, [address]',
            STORE: 'STORE R{0-3}, [address]'
        };
    }
}
