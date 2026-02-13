/**
 * Animation Controller - MODE ROUTER + USER INPUT HANDLER
 * Routes to appropriate animator based on selected mode
 * Supports both predefined and user-entered instructions
 */

import { InstructionCycleMode } from './instructionCycleMode.js';
import { MicroOperationMode } from './microOperationMode.js';
import { DataFlow } from './dataFlow.js';
import { InstructionParser } from './instructionParser.js';
import { TemplateInstructionGenerator } from './templateInstructionGenerator.js';
import { InstructionDefinitions } from './instructionDefinitions.js';
import { MicroOpDefinitions } from './microOpDefinitions.js';
import { CPUState } from './cpuState.js';

export class AnimationController {
    constructor(cpuModel, scene) {
        this.cpuModel = cpuModel;
        this.scene = scene;
        this.dataFlow = new DataFlow(scene);
        this.cpuState = new CPUState();

        // Initialize mode handlers (passing 'this' to allow interrupt checks)
        this.instructionCycleMode = new InstructionCycleMode(cpuModel, scene, this.dataFlow, this);
        this.microOperationMode = new MicroOperationMode(cpuModel, scene, this.dataFlow, this);

        // Initialize user input components
        this.parser = new InstructionParser();
        this.instructionDefs = new InstructionDefinitions();
        this.microOpDefs = new MicroOpDefinitions();
        this.generator = new TemplateInstructionGenerator(this.instructionDefs, this.microOpDefs);

        this.currentMode = 'instruction-cycle';
        this.speedMultiplier = 1.0;
        this.isAnimating = false;
        this.currentInstruction = null;

        // Track last executed instruction for replay
        this.lastInstructionName = null;  // For predefined buttons (e.g., "ADD_R1_R2")
        this.lastParsedInstruction = null; // For user input instructions
        this.shouldInterrupt = false;      // Flag to interrupt current animation
    }

    /**
     * Set visualization mode
     */
    setMode(mode) {
        if (this.isAnimating) {
            console.log('Cannot change mode during animation');
            return false;
        }

        this.currentMode = mode;
        console.log(`Mode changed to: ${mode}`);

        // Update UI
        const modeElement = document.getElementById('current-mode');
        if (modeElement) {
            modeElement.textContent = mode === 'instruction-cycle'
                ? 'Instruction Cycle'
                : 'Micro-Operations';
        }

        return true;
    }

    /**
     * Set animation speed
     */
    setSpeed(multiplier) {
        this.speedMultiplier = multiplier;
        console.log(`Speed set to: ${multiplier}x`);
    }

    /**
     * Execute predefined instruction (from buttons)
     */
    async executeInstruction(instructionName) {
        // Track instruction immediately for Replay support
        this.lastInstructionName = instructionName;
        this.lastParsedInstruction = null;

        // Clear logic for Replay: stop current before starting new
        if (this.isAnimating) {
            console.log('⚡ Interrupting current animation for new instruction...');
            await this.abortCurrentAnimation();
        }

        this.isAnimating = true;
        this.currentInstruction = instructionName;
        this.shouldInterrupt = false;

        this.updateInstructionDisplay(instructionName);

        try {
            if (this.currentMode === 'instruction-cycle') {
                await this.instructionCycleMode.execute(instructionName, this.speedMultiplier);
            } else if (this.currentMode === 'micro-operation') {
                await this.microOperationMode.execute(instructionName, this.speedMultiplier);
            }

            if (this.shouldInterrupt) {
                console.log('🛑 Execution cycle halted by interrupt');
                this.isAnimating = false;
                this.currentInstruction = null; // Safety reset
                return { success: false, interrupted: true };
            }

            // Update logical state
            this.cpuState.executeInstruction(instructionName);
            ['R0', 'R1', 'R2', 'R3'].forEach(reg => {
                this.cpuModel.updateRegisterDisplay(reg, this.cpuState.getRegister(reg));
            });

            this.lastInstructionName = instructionName;
            this.lastParsedInstruction = null;

            this.isAnimating = false;
            this.currentInstruction = null;
            this.updateStageDisplay('Ready', 'Select an instruction to begin');
            return { success: true };

        } catch (error) {
            console.error('Animation error:', error);
            this.isAnimating = false;
            this.currentInstruction = null;
            return { success: false, error: error.message };
        }
    }

    async executeUserInstruction(userInput) {
        if (this.isAnimating) {
            console.log('⚡ Interrupting current animation for user instruction...');
            await this.abortCurrentAnimation();
        }

        const parsed = this.parser.parse(userInput);
        if (!parsed.valid) return { success: false, error: parsed.error };

        // Track instruction immediately for Replay support
        this.lastParsedInstruction = parsed;
        this.lastInstructionName = null;

        this.isAnimating = true;
        this.currentInstruction = parsed.displayName;
        this.shouldInterrupt = false;

        // Update UI
        this.updateInstructionDisplay(parsed.displayName);

        try {
            // Generate sequence from template
            let sequence;
            if (this.currentMode === 'instruction-cycle') {
                sequence = this.generator.generateInstructionCycleSequence(parsed);
                await this.executeCustomInstructionCycle(sequence);
            } else {
                sequence = this.generator.generateMicroOpSequence(parsed);
                await this.executeCustomMicroOps(sequence);
            }

            // Check if interrupted
            if (this.shouldInterrupt) {
                console.log('Animation interrupted');
                this.isAnimating = false;
                this.shouldInterrupt = false;
                return { success: false, error: 'Animation interrupted' };
            }

            // Update logical state
            this.cpuState.executeInstruction(parsed.type, parsed.params);

            // Sync visual state for registers
            ['R0', 'R1', 'R2', 'R3'].forEach(reg => {
                this.cpuModel.updateRegisterDisplay(reg, this.cpuState.getRegister(reg));
            });

            // Track last executed instruction
            this.lastParsedInstruction = parsed;
            this.lastInstructionName = null; // Clear button instruction

            this.isAnimating = false;
            this.currentInstruction = null;

            // Reset UI
            this.updateStageDisplay('Ready', 'Enter another instruction or select from examples');

            return {
                success: true,
                message: 'Instruction executed successfully',
                parsed: parsed  // Return parsed instruction with binary data
            };

        } catch (error) {
            console.error('User instruction error:', error);
            this.isAnimating = false;
            this.currentInstruction = null;
            return { success: false, error: 'Animation error occurred' };
        }
    }

    /**
     * Execute custom instruction cycle sequence
     */
    async executeCustomInstructionCycle(sequence) {
        for (const stage of sequence) {
            if (this.shouldInterrupt) return;
            this.updateStageDisplay(stage.stage, stage.description);
            await this.instructionCycleMode.executeStage(stage, this.speedMultiplier);
            if (this.shouldInterrupt) return;
            await this.delay(800);
            if (this.shouldInterrupt) return;
        }
    }

    /**
     * Execute custom micro-operation sequence
     */
    async executeCustomMicroOps(sequence) {
        for (const tState of sequence) {
            if (this.shouldInterrupt) return;
            this.microOperationMode.updateTStateDisplay(tState.tState, tState.description);
            await this.microOperationMode.executeTState(tState, this.speedMultiplier);
            if (this.shouldInterrupt) return;
            await this.delay(1000);
            if (this.shouldInterrupt) return;
        }
    }

    /**
     * Update stage display banner
     */
    updateStageDisplay(stage, description) {
        const stageElement = document.getElementById('stage-title');
        const explanationElement = document.getElementById('stage-explanation');
        const currentStageElement = document.getElementById('current-stage');

        if (stageElement) stageElement.textContent = stage;
        if (explanationElement) explanationElement.textContent = description;
        if (currentStageElement) currentStageElement.textContent = stage;
    }

    /**
     * Update instruction display
     */
    updateInstructionDisplay(instruction) {
        const instructionElement = document.getElementById('current-instruction');
        if (instructionElement) {
            const displayName = this.getInstructionDisplayName(instruction);
            instructionElement.textContent = displayName;

            // Update binary opcode display
            this.updateOpcode(instruction);
        }
    }

    /**
     * Update 16-bit binary opcode display based on instruction
     */
    updateOpcode(instruction) {
        const opcodeElement = document.getElementById('binary-opcode');
        if (!opcodeElement) return;

        // Default: 0000 0000 0000 0000
        let binary = "0000 0000 0000 0000";

        if (!instruction || instruction === 'None') {
            opcodeElement.textContent = binary;
            return;
        }

        // Mapping from requirement
        const mapping = {
            'MOV R1, #5': '0001 0100 0000 0101',
            'ADD R1, R2': '0010 0110 0000 0000',
            'SUB R1, R2': '0011 0110 0000 0000',
            'MUL R2, R3': '0100 1011 0000 0000',
            'DIV R1, R2': '0101 0110 0000 0000',
            'AND R2, R3': '0110 1011 0000 0000',
            'LOAD R1, [100]': '0111 0100 0110 0100',
            'STORE R2, [200]': '1000 1000 1100 1000'
        };

        // Internal ID Mapping
        const internalIdMapping = {
            'MOV_R1_5': '0001 0100 0000 0101',
            'ADD_R1_R2': '0010 0110 0000 0000',
            'SUB_R1_R2': '0011 0110 0000 0000',
            'MUL_R2_R3': '0100 1011 0000 0000',
            'DIV_R1_R2': '0101 0110 0000 0000',
            'AND_R2_R3': '0110 1011 0000 0000',
            'LOAD_R1_100': '0111 0100 0110 0100',
            'STORE_R2_200': '1000 1000 1100 1000'
        };

        // Try direct lookup (internal ID)
        if (internalIdMapping[instruction]) {
            binary = internalIdMapping[instruction];
        } else {
            // Try lookup by display name (user input or resolved display name)
            const displayName = this.getInstructionDisplayName(instruction);
            binary = mapping[displayName] || binary;
        }

        opcodeElement.textContent = binary;
    }

    /**
     * Update micro-operation T-state indicator
     */
    updateMicroOpIndicator(tState, description) {
        const indicator = document.getElementById('micro-op-indicator');
        const tStateValue = document.getElementById('tstate-value');
        const microOpText = document.getElementById('micro-op-text');

        if (this.currentMode === 'micro-operation') {
            if (indicator) indicator.style.display = 'block';
            if (tStateValue) tStateValue.textContent = tState;
            if (microOpText) microOpText.textContent = description;
        } else {
            if (indicator) indicator.style.display = 'none';
        }
    }

    /**
     * Get friendly instruction name
     */
    getInstructionDisplayName(instructionName) {
        const names = {
            'MOV_R1_5': 'MOV R1, #5',
            'ADD_R1_R2': 'ADD R1, R2',
            'LOAD_R1_100': 'LOAD R1, [100]',
            'STORE_R2_200': 'STORE R2, [200]',
            'None': 'None'
        };
        return names[instructionName] || instructionName;
    }

    /**
     * Reset visualization AND register values
     */
    reset() {
        // Stop any running animation
        this.shouldInterrupt = true;

        this.cpuModel.resetAll();
        this.dataFlow.clearAllTokens();
        this.isAnimating = false;
        this.currentInstruction = null;

        // Reset all register values to 0
        this.resetRegisters();

        this.updateStageDisplay('Ready', 'Enter an instruction or select from examples');
        this.updateInstructionDisplay('None');
        this.updateMicroOpIndicator('T0', '');

        const actionElement = document.getElementById('current-action');
        if (actionElement) actionElement.textContent = 'Waiting...';

        // Clear user input
        const userInput = document.getElementById('user-instruction-input');
        if (userInput) userInput.value = '';

        // Clear error message
        const errorMsg = document.getElementById('instruction-error');
        if (errorMsg) errorMsg.textContent = '';

        console.log('✓ System reset - all registers cleared');
    }

    /**
     * Replay last executed instruction
     * Stops current animation if running and restarts from beginning
     */
    async replay() {
        if (!this.lastInstructionName && !this.lastParsedInstruction) {
            console.log('No instruction to replay');
            return { success: false, error: 'No instruction to replay' };
        }

        console.log('🔄 Replaying last instruction...');

        // Set interrupt flag to stop current animation
        await this.abortCurrentAnimation();

        // Clear visual state before restarting
        this.cpuModel.resetAll();
        this.dataFlow.clearAllTokens();

        // Replay the appropriate instruction type
        if (this.lastInstructionName) {
            // Replay predefined button instruction
            return await this.executeInstruction(this.lastInstructionName);
        } else if (this.lastParsedInstruction) {
            // Replay user-entered instruction
            // Re-execute using the parsed data
            this.isAnimating = true;
            this.currentInstruction = this.lastParsedInstruction.displayName;
            this.shouldInterrupt = false;

            this.updateInstructionDisplay(this.lastParsedInstruction.displayName);

            try {
                let sequence;
                if (this.currentMode === 'instruction-cycle') {
                    sequence = this.generator.generateInstructionCycleSequence(this.lastParsedInstruction);
                    await this.executeCustomInstructionCycle(sequence);
                } else {
                    sequence = this.generator.generateMicroOpSequence(this.lastParsedInstruction);
                    await this.executeCustomMicroOps(sequence);
                }

                if (this.shouldInterrupt) {
                    console.log('Replay interrupted');
                    this.isAnimating = false;
                    return { success: false, interrupted: true };
                }

                // Update logical state
                this.cpuState.executeInstruction(this.lastParsedInstruction.type, this.lastParsedInstruction.params);

                // Sync visual state
                ['R0', 'R1', 'R2', 'R3'].forEach(reg => {
                    this.cpuModel.updateRegisterDisplay(reg, this.cpuState.getRegister(reg));
                });

                this.isAnimating = false;
                this.currentInstruction = null;
                this.updateStageDisplay('Ready', 'Enter another instruction or select from examples');

                return {
                    success: true,
                    parsed: this.lastParsedInstruction
                };

            } catch (error) {
                console.error('Replay error:', error);
                this.isAnimating = false;
                this.currentInstruction = null;
                return { success: false, error: 'Replay error occurred' };
            }
        }
        return { success: false, error: 'Replay failed' };
    }

    /**
     * Robustly stop the current animation and clear state
     */
    async abortCurrentAnimation() {
        this.shouldInterrupt = true;
        this.dataFlow.clearAllTokens();
        this.cpuModel.resetAll();

        let waitCount = 0;
        while (this.isAnimating && waitCount < 30) {
            await new Promise(r => setTimeout(r, 20));
            waitCount++;
        }

        this.isAnimating = false;
        this.shouldInterrupt = false; // Reset for next run
    }

    /**
     * Stop current animation (Legacy alias)
     */
    async stopCurrentAnimation() {
        await this.abortCurrentAnimation();
    }

    /**
     * Reset all register values to 0
     */
    resetRegisters() {
        ['R0', 'R1', 'R2', 'R3'].forEach(reg => {
            this.cpuState.setRegister(reg, 0);
            this.cpuModel.updateRegisterDisplay(reg, 0);
        });
    }

    /**
     * Utility delay with speed multiplier
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms / this.speedMultiplier));
    }
}
