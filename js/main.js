/**
 * AR CPU Instruction Execution Visualizer
 * Main Application Entry Point
 * 
 * This is a VISUALIZATION system - no actual computation occurs.
 * Each instruction triggers predefined animation sequences.
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
            console.log('Initializing AR CPU Visualizer...');
            
            // Step 1: Initialize AR Scene with camera
            this.arScene = new ARScene();
            await this.arScene.init();
            console.log('✓ AR Scene initialized');
            
            // Step 2: Build CPU 3D Model
            this.cpuModel = new CPUModel(this.arScene.scene);
            this.cpuModel.build();
            console.log('✓ CPU Model built');
            
            // Step 3: Initialize Animation Controller
            this.animationController = new AnimationController(
                this.cpuModel,
                this.arScene.scene
            );
            console.log('✓ Animation Controller ready');
            
            // Step 4: Setup UI and Event Handlers
            this.ui = new UI(this.animationController);
            this.ui.init();
            console.log('✓ UI initialized');
            
            // Step 5: Start render loop
            this.arScene.startRenderLoop();
            
            // Hide loading overlay
            this.hideLoadingOverlay();
            
            this.isInitialized = true;
            console.log('✓ AR CPU Visualizer ready!');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize AR. Please check camera permissions.');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
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
                                   border-radius: 5px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new ARCPUVisualizer();
    app.init();
});

// Export for debugging
window.ARCPUVisualizer = ARCPUVisualizer;