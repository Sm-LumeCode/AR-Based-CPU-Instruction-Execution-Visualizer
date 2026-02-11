/**
 * UI Controller - WITH USER INPUT SUPPORT
 * Handles all user interactions including text input
 */

export class UI {
    constructor(animationController) {
        this.animationController = animationController;
        this.currentMode = 'instruction-cycle';
        this.currentSpeed = 1.0;


    }

    init() {
        this.setupModeButtons();
        this.setupSpeedButtons();
        this.setupInstructionButtons();
        this.setupUserInput();
        this.setupResetButton();
    }

    /**
     * Mode selection buttons
     */
    setupModeButtons() {
        const modeButtons = document.querySelectorAll('.mode-btn');

        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.dataset.mode;

                if (this.animationController.setMode(mode)) {
                    // Update UI
                    modeButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.currentMode = mode;

                    console.log(`✓ Mode switched to: ${mode}`);
                }
            });
        });
    }

    /**
     * Speed control buttons
     */
    setupSpeedButtons() {
        const speedButtons = document.querySelectorAll('.speed-btn');

        speedButtons.forEach(button => {
            button.addEventListener('click', () => {
                const speed = parseFloat(button.dataset.speed);

                this.animationController.setSpeed(speed);

                // Update UI
                speedButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentSpeed = speed;

                console.log(`✓ Speed set to: ${speed}x`);
            });
        });
    }

    /**
     * Predefined instruction selection buttons
     */
    setupInstructionButtons() {
        const buttons = document.querySelectorAll('.instruction-btn');

        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const instruction = button.dataset.instruction;

                // Disable all buttons during animation
                this.disableButtons(true);
                this.clearError();

                // Execute instruction
                await this.animationController.executeInstruction(instruction);

                // Re-enable buttons
                this.disableButtons(false);
            });
        });
    }

    /**
     * User input text field and execute button - NEW
     */
    setupUserInput() {
        const input = document.getElementById('user-instruction-input');
        const executeBtn = document.getElementById('execute-user-btn');

        if (!input || !executeBtn) {
            console.warn('User input elements not found');
            return;
        }

        // Execute on button click
        executeBtn.addEventListener('click', () => {
            this.executeUserInput(input.value);
        });

        // Execute on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeUserInput(input.value);
            }
        });

        // Clear error on input
        input.addEventListener('input', () => {
            this.clearError();
        });
    }

    /**
     * Execute user-entered instruction
     */
    async executeUserInput(userText) {
        const input = document.getElementById('user-instruction-input');

        // Disable UI during execution
        this.disableButtons(true);
        if (input) input.disabled = true;

        // Execute through animation controller
        const result = await this.animationController.executeUserInstruction(userText);

        if (result.success) {
            // Success - clear input and error
            if (input) input.value = '';
            this.clearError();
            console.log('✓ User instruction executed:', userText);
        } else {
            // Error - show message
            this.showError(result.error);
            console.log('✗ Invalid instruction:', userText);
        }

        // Re-enable UI
        this.disableButtons(false);
        if (input) input.disabled = false;
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorElement = document.getElementById('instruction-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /**
     * Clear error message
     */
    clearError() {
        const errorElement = document.getElementById('instruction-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /**
     * Reset button
     */
    setupResetButton() {
        const resetBtn = document.getElementById('reset-btn');

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.animationController.reset();
                this.clearError();
                console.log('✓ System reset');
            });
        }
    }

    /**
     * Disable/enable all instruction buttons and user input
     */
    disableButtons(disabled) {
        // Instruction buttons
        const buttons = document.querySelectorAll('.instruction-btn');
        buttons.forEach(button => {
            button.disabled = disabled;
            if (disabled) {
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
            } else {
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
            }
        });

        // User input execute button
        const executeBtn = document.getElementById('execute-user-btn');
        if (executeBtn) {
            executeBtn.disabled = disabled;
            if (disabled) {
                executeBtn.style.opacity = '0.5';
                executeBtn.style.cursor = 'not-allowed';
            } else {
                executeBtn.style.opacity = '1';
                executeBtn.style.cursor = 'pointer';
            }
        }
    }
}
