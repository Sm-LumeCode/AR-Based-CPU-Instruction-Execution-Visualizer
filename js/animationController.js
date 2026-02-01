/**
 * Animation Controller - WITH EDUCATIONAL CONTEXT
 * Orchestrates the execution of instruction animation sequences
 * NOW with detailed explanations for each step
 */

import { InstructionAnimations } from './instructionAnimations.js';
import { DataFlow } from './dataFlow.js';

export class AnimationController {
    constructor(cpuModel, scene) {
        this.cpuModel = cpuModel;
        this.scene = scene;
        this.instructionAnimations = new InstructionAnimations();
        this.dataFlow = new DataFlow(scene);
        this.isAnimating = false;
        this.currentInstruction = null;
    }

    async executeInstruction(instructionName) {
        if (this.isAnimating) {
            console.log('Animation already in progress');
            return;
        }

        this.isAnimating = true;
        this.currentInstruction = instructionName;

        // Get instruction details
        const instructionInfo = this.getInstructionInfo(instructionName);
        this.updateInstructionDisplay(instructionInfo.display);

        const sequence = this.instructionAnimations.getSequence(instructionName);
        
        if (!sequence || sequence.length === 0) {
            console.error('No animation sequence found for:', instructionName);
            this.isAnimating = false;
            return;
        }

        // Execute each stage sequentially
        for (const stage of sequence) {
            // Update UI with detailed stage info
            this.updateStageDisplay(stage.stage, stage.description, stage.explanation);
            
            // Execute all steps in this stage
            await this.executeStage(stage);
            
            // Pause between stages for comprehension
            await this.delay(800);
        }

        this.isAnimating = false;
        this.currentInstruction = null;
        this.updateStageDisplay('Ready', 'Click an instruction to see how it executes in the CPU', '');
        this.updateInstructionDisplay('None');
    }

    getInstructionInfo(instructionName) {
        const info = {
            'MOV_R1_5': { display: 'MOV R1, #5', meaning: 'Moving value 5 into Register R1' },
            'ADD_R1_R2': { display: 'ADD R1, R2', meaning: 'Adding R1 and R2, storing in R1' },
            'LOAD_R1_100': { display: 'LOAD R1, [100]', meaning: 'Loading from memory[100] to R1' },
            'STORE_R2_200': { display: 'STORE R2, [200]', meaning: 'Storing R2 into memory[200]' },
            'SUB_R3_R1': { display: 'SUB R3, R1', meaning: 'Subtracting R1 from R3' },
            'MUL_R2_R3': { display: 'MUL R2, R3', meaning: 'Multiplying R2 and R3' }
        };
        return info[instructionName] || { display: instructionName, meaning: '' };
    }

    async executeStage(stage) {
        for (const step of stage.steps) {
            // Update action display
            this.updateActionDisplay(step);
            await this.executeStep(step);
        }
    }

    async executeStep(step) {
        switch (step.type) {
            case 'highlight':
                return this.highlightComponent(step);
            
            case 'dataToken':
                return this.animateDataToken(step);
            
            case 'glowingWire':
                return this.animateGlowingWire(step);
            
            case 'reset':
                return this.resetComponents(step);
            
            default:
                console.warn('Unknown step type:', step.type);
                return Promise.resolve();
        }
    }

    async highlightComponent(step) {
        this.cpuModel.highlightComponent(step.component, step.color);
        await this.delay(step.duration * 1000);
    }

    async animateDataToken(step) {
        const fromPos = this.getComponentPosition(step.from);
        const toPos = this.getComponentPosition(step.to);
        
        if (!fromPos || !toPos) {
            console.warn('Invalid component positions:', step.from, step.to);
            return;
        }

        await this.dataFlow.createDataToken(
            fromPos,
            toPos,
            step.color,
            step.duration,
            step.label
        );
    }

    async animateGlowingWire(step) {
        const fromPos = this.getComponentPosition(step.from);
        const toPos = this.getComponentPosition(step.to);
        
        if (!fromPos || !toPos) {
            console.warn('Invalid component positions:', step.from, step.to);
            return;
        }

        await this.dataFlow.createGlowingWire(
            fromPos,
            toPos,
            step.color,
            step.duration
        );
    }

    async resetComponents(step) {
        if (step.component === 'all') {
            this.cpuModel.resetAll();
        } else {
            this.cpuModel.resetComponent(step.component);
        }
        await this.delay(200);
    }

    getComponentPosition(componentName) {
        const component = this.cpuModel.components[componentName];
        if (!component) {
            console.warn('Component not found:', componentName);
            return null;
        }

        const worldPosition = new THREE.Vector3();
        component.getWorldPosition(worldPosition);
        return worldPosition;
    }

    updateStageDisplay(stage, description, explanation) {
        const stageElement = document.getElementById('stage-title');
        const explanationElement = document.getElementById('stage-explanation');
        const currentStageElement = document.getElementById('current-stage');
        
        if (stageElement) {
            stageElement.textContent = stage;
        }
        
        if (explanationElement) {
            explanationElement.textContent = description;
        }
        
        if (currentStageElement) {
            currentStageElement.textContent = stage;
        }
    }

    updateInstructionDisplay(instruction) {
        const instructionElement = document.getElementById('current-instruction');
        if (instructionElement) {
            instructionElement.textContent = instruction;
        }
    }

    updateActionDisplay(step) {
        const actionElement = document.getElementById('current-action');
        if (!actionElement) return;

        let actionText = '';
        
        switch (step.type) {
            case 'highlight':
                actionText = `Activating ${step.component}`;
                break;
            case 'dataToken':
                const dataType = this.getDataType(step.color);
                actionText = `${dataType} flowing: ${step.from} → ${step.to}`;
                break;
            case 'glowingWire':
                actionText = `Control signal: ${step.from} → ${step.to}`;
                break;
            case 'reset':
                actionText = 'Completing operation...';
                break;
            default:
                actionText = 'Processing...';
        }
        
        actionElement.textContent = actionText;
    }

    getDataType(color) {
        const colorMap = {
            0x0000ff: 'Address',
            0x00ff00: 'Data',
            0xffff00: 'Control',
            0xff0000: 'Write',
            0x00ffff: 'Signal'
        };
        return colorMap[color] || 'Signal';
    }

    reset() {
        this.cpuModel.resetAll();
        this.dataFlow.clearAllTokens();
        this.isAnimating = false;
        this.currentInstruction = null;
        this.updateStageDisplay('Ready', 'Click an instruction to see how it executes in the CPU', '');
        this.updateInstructionDisplay('None');
        this.updateActionDisplay({ type: 'reset' });
        
        const actionElement = document.getElementById('current-action');
        if (actionElement) {
            actionElement.textContent = 'Waiting...';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}