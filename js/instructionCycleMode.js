/**
 * Instruction Cycle Mode (Mode 1)
 * High-level visualization: Fetch → Decode → Execute → Memory → Write-back
 */

import { InstructionDefinitions } from './instructionDefinitions.js';

export class InstructionCycleMode {
    constructor(cpuModel, scene, dataFlow, controller = null) {
        this.cpuModel = cpuModel;
        this.scene = scene;
        this.dataFlow = dataFlow;
        this.controller = controller;
        this.definitions = new InstructionDefinitions();
    }

    async execute(instructionName, speedMultiplier = 1.0) {
        const sequence = this.definitions.getInstructionCycleSequence(instructionName);

        if (!sequence || sequence.length === 0) {
            console.error('No instruction cycle sequence found for:', instructionName);
            return;
        }

        // Hide T-State indicator in Instruction Cycle mode
        const indicator = document.getElementById('micro-op-indicator');
        if (indicator) indicator.style.display = 'none';

        // Safety reset before instruction starts
        this.cpuModel.resetAll();

        for (const stage of sequence) {
            // 🛑 Interrupt Check: Stop if controller requested it
            if (this.controller && this.controller.shouldInterrupt) {
                console.log('⚡ InstructionCycleMode: Execution Interrupted');
                this.cpuModel.resetAll();
                return;
            }

            this.updateStageDisplay(stage.stage, stage.description);
            await this.executeStage(stage, speedMultiplier);

            // 🛑 Interrupt Check: Check immediately after stage returns
            if (this.controller && this.controller.shouldInterrupt) return;

            // Stage-level reset
            this.cpuModel.resetAll();
            await this.delay(800, speedMultiplier);

            // 🛑 Interrupt Check: Check after intra-stage delay
            if (this.controller && this.controller.shouldInterrupt) return;
        }
    }

    async executeStage(stage, speedMultiplier) {
        for (const step of stage.steps) {
            // 🛑 Early exit if interrupted
            if (this.controller && this.controller.shouldInterrupt) return;

            this.updateActionDisplay(step);
            await this.executeStep(step, speedMultiplier);

            // 🛑 Check again after step execution
            if (this.controller && this.controller.shouldInterrupt) return;
        }
    }

    async executeStep(step, speedMultiplier) {
        switch (step.type) {
            case 'highlight':
                return this.highlightComponent(step, speedMultiplier);
            case 'dataToken':
                return this.animateDataToken(step, speedMultiplier);
            case 'glowingWire':
                return this.animateGlowingWire(step, speedMultiplier);
            case 'reset':
                return this.resetComponents(step);
            default:
                console.warn('Unknown step type:', step.type);
        }
    }

    async highlightComponent(step, speedMultiplier) {
        // 🔧 FIX 1: Clear previous highlight so only ONE component is active
        this.cpuModel.resetAll();

        // Highlight current component (always use cyan as per user request)
        this.cpuModel.highlightComponent(step.component, 0x00ffff);

        // Wait for highlight duration
        await this.delay(step.duration * 1000, speedMultiplier);

        // 🔧 FIX 2: Restore component back to normal immediately
        this.cpuModel.resetComponent(step.component);
    }

    async animateDataToken(step, speedMultiplier) {
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
            step.duration / speedMultiplier,
            step.label
        );
    }

    async animateGlowingWire(step, speedMultiplier) {
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
            step.duration / speedMultiplier
        );
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

    updateStageDisplay(stage, description) {
        const stageElement = document.getElementById('stage-title');
        const explanationElement = document.getElementById('stage-explanation');
        const currentStageElement = document.getElementById('current-stage');

        if (stageElement) stageElement.textContent = stage;
        if (explanationElement) explanationElement.textContent = description;
        if (currentStageElement) currentStageElement.textContent = stage;
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

    async delay(ms, speedMultiplier) {
        const duration = ms / speedMultiplier;
        const start = Date.now();
        while (Date.now() - start < duration) {
            // Poll for interrupt flag more frequently for better responsiveness
            if (this.controller && this.controller.shouldInterrupt) return;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}