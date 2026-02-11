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

        // Initialize mode handlers
        this.instructionCycleMode = new InstructionCycleMode(cpuModel, scene, this.dataFlow);
        this.microOperationMode = new MicroOperationMode(cpuModel, scene, this.dataFlow);

        // Initialize user input components
        this.parser = new InstructionParser();
        this.instructionDefs = new InstructionDefinitions();
        this.microOpDefs = new MicroOpDefinitions();
        this.generator = new TemplateInstructionGenerator(this.instructionDefs, this.microOpDefs);

        this.currentMode = 'instruction-cycle';
        this.speedMultiplier = 1.0;
        this.isAnimating = false;
        this.currentInstruction = null;
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
        if (this.isAnimating) {
            console.log('Animation already in progress');
            return;
        }

        this.isAnimating = true;
        this.currentInstruction = instructionName;

        // Update UI
        this.updateInstructionDisplay(instructionName);

        try {
            // Route to appropriate mode handler
            if (this.currentMode === 'instruction-cycle') {
                await this.instructionCycleMode.execute(instructionName, this.speedMultiplier);
            } else if (this.currentMode === 'micro-operation') {
                await this.microOperationMode.execute(instructionName, this.speedMultiplier);
            }

            // Update logical state
            this.cpuState.executeInstruction(instructionName);

            // Sync visual state for registers
            ['R0', 'R1', 'R2', 'R3'].forEach(reg => {
                this.cpuModel.updateRegisterDisplay(reg, this.cpuState.getRegister(reg));
            });

        } catch (error) {
            console.error('Animation error:', error);
        }

        this.isAnimating = false;
        this.currentInstruction = null;

        // Reset UI
        this.updateStageDisplay('Ready', 'Select an instruction to begin visualization');
        this.updateInstructionDisplay('None');
    }

    /**
     * Execute user-entered instruction (from text input)
     * TEMPLATE MATCHING ONLY - NO COMPUTATION
     */
    async executeUserInstruction(userInput) {
        if (this.isAnimating) {
            return { success: false, error: 'Animation already in progress' };
        }

        // Parse user input
        const parsed = this.parser.parse(userInput);

        if (!parsed.valid) {
            return { success: false, error: parsed.error };
        }

        this.isAnimating = true;
        this.currentInstruction = parsed.displayName;

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

            // Update logical state
            this.cpuState.executeInstruction(parsed.type, parsed.params);

            // Sync visual state for registers
            ['R0', 'R1', 'R2', 'R3'].forEach(reg => {
                this.cpuModel.updateRegisterDisplay(reg, this.cpuState.getRegister(reg));
            });

            this.isAnimating = false;
            this.currentInstruction = null;

            // Reset UI
            this.updateStageDisplay('Ready', 'Enter another instruction or select from examples');

            return { success: true, message: 'Instruction executed successfully' };

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
            this.updateStageDisplay(stage.stage, stage.description);
            await this.instructionCycleMode.executeStage(stage, this.speedMultiplier);
            await this.delay(800);
        }
    }

    /**
     * Execute custom micro-operation sequence
     */
    async executeCustomMicroOps(sequence) {
        for (const tState of sequence) {
            this.microOperationMode.updateTStateDisplay(tState.tState, tState.description);
            await this.microOperationMode.executeTState(tState, this.speedMultiplier);
            await this.delay(1000);
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
        }
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
     * Reset visualization
     */
    reset() {
        this.cpuModel.resetAll();
        this.dataFlow.clearAllTokens();
        this.isAnimating = false;
        this.currentInstruction = null;

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
    }

    /**
     * Utility delay with speed multiplier
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms / this.speedMultiplier));
    }
}
