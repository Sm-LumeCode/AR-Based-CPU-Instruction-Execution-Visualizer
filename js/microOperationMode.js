/**
 * Micro-Operation Mode (Mode 2)
 * T-state level visualization showing individual micro-operations
 */

import { MicroOpDefinitions } from './microOpDefinitions.js';

export class MicroOperationMode {
    constructor(cpuModel, scene, dataFlow) {
        this.cpuModel = cpuModel;
        this.scene = scene;
        this.dataFlow = dataFlow;
        this.definitions = new MicroOpDefinitions();
    }

    async execute(instructionName, speedMultiplier = 1.0) {
        const sequence = this.definitions.getMicroOpSequence(instructionName);
        
        if (!sequence || sequence.length === 0) {
            console.error('No micro-op sequence found for:', instructionName);
            return;
        }

        // Execute each T-state
        for (const tState of sequence) {
            this.updateTStateDisplay(tState.tState, tState.description);
            await this.executeTState(tState, speedMultiplier);
            await this.delay(1000, speedMultiplier); // Pause between T-states
        }
    }

    async executeTState(tState, speedMultiplier) {
        for (const step of tState.steps) {
            await this.executeStep(step, speedMultiplier);
        }
    }

    async executeStep(step, speedMultiplier) {
        switch (step.type) {
            case 'highlight':
                return this.highlightComponent(step, speedMultiplier);
            case 'transfer':
                return this.animateTransfer(step, speedMultiplier);
            case 'signal':
                return this.animateSignal(step, speedMultiplier);
            case 'reset':
                return this.resetComponents(step);
            default:
                console.warn('Unknown step type:', step.type);
        }
    }

    async highlightComponent(step, speedMultiplier) {
        this.cpuModel.highlightComponent(step.component, step.color);
        await this.delay(step.duration * 1000, speedMultiplier);
    }

    async animateTransfer(step, speedMultiplier) {
        const fromPos = this.getComponentPosition(step.from);
        const toPos = this.getComponentPosition(step.to);
        
        if (!fromPos || !toPos) {
            console.warn('Invalid component positions:', step.from, step.to);
            return;
        }

        // Highlight source
        this.cpuModel.highlightComponent(step.from, 0x00ffff);
        await this.delay(300, speedMultiplier);

        // Create data token
        await this.dataFlow.createDataToken(fromPos, toPos, step.color, step.duration / speedMultiplier, step.label);

        // Highlight destination
        this.cpuModel.highlightComponent(step.to, step.color);
        await this.delay(400, speedMultiplier);

        // Reset source
        this.cpuModel.resetComponent(step.from);
    }

    async animateSignal(step, speedMultiplier) {
        const fromPos = this.getComponentPosition(step.from);
        const toPos = this.getComponentPosition(step.to);
        
        if (!fromPos || !toPos) return;

        await this.dataFlow.createGlowingWire(fromPos, toPos, step.color, step.duration / speedMultiplier);
    }

    async resetComponents(step) {
        if (step.component === 'all') {
            this.cpuModel.resetAll();
        } else {
            this.cpuModel.resetComponent(step.component);
        }
        await this.delay(200, 1);
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

    updateTStateDisplay(tState, description) {
        // Update main banner
        const stageElement = document.getElementById('stage-title');
        const explanationElement = document.getElementById('stage-explanation');
        
        if (stageElement) stageElement.textContent = `Micro-Operation: ${tState}`;
        if (explanationElement) explanationElement.textContent = description;

        // Update T-state indicator
        const indicator = document.getElementById('micro-op-indicator');
        const tStateValue = document.getElementById('tstate-value');
        const microOpText = document.getElementById('micro-op-text');
        
        if (indicator) indicator.style.display = 'block';
        if (tStateValue) tStateValue.textContent = tState;
        if (microOpText) microOpText.textContent = description;

        // Update status
        const currentStageElement = document.getElementById('current-stage');
        if (currentStageElement) currentStageElement.textContent = tState;

        const actionElement = document.getElementById('current-action');
        if (actionElement) actionElement.textContent = description;
    }

    delay(ms, speedMultiplier) {
        return new Promise(resolve => setTimeout(resolve, ms / speedMultiplier));
    }
}