/**
 * AR CPU Micro-Operation Visualizer
 * Main Application Entry Point
 */

import { ARScene } from './arScene.js';
import { CPUModel } from './cpuModel.js';
import { AnimationController } from './animationController.js';
import { UI } from './ui.js';


class ARCPUVisualizer {
    constructor() {
        this.arScene = null;
        this.cpuModel = null;
        this.animationController = null;
        this.ui = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('🚀 Initializing AR CPU Visualizer...');

            this.arScene = new ARScene();
            await this.arScene.init();
            console.log('✓ AR Scene initialized');

            this.cpuModel = new CPUModel(this.arScene.scene);
            this.cpuModel.build();
            console.log('✓ CPU Model built');

            this.animationController = new AnimationController(
                this.cpuModel,
                this.arScene.scene
            );
            console.log('✓ Animation Controller ready');

            this.ui = new UI(this.animationController);
            this.ui.init();
            console.log('✓ UI initialized');



            this.arScene.startRenderLoop();
            this.hideLoadingOverlay();

            this.isInitialized = true;
            console.log('✅ AR CPU Visualizer ready!');

        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showError('Failed to initialize AR. Please check camera permissions.');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 500);
        }
    }

    showError(message) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="loading-content">
                    <h2 style="color: #ff4444;">Error</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()" 
                            style="margin-top: 20px; padding: 10px 20px; 
                                   background: #00ffff; border: none; 
                                   border-radius: 5px; cursor: pointer; color: #000;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new ARCPUVisualizer();
    app.init();
});

window.ARCPUVisualizer = ARCPUVisualizer;