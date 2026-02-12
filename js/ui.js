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
        this.setupReplayButton();
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

                // Parse the instruction code from button to get binary
                const instCode = button.querySelector('.inst-code');
                if (instCode) {
                    const assemblyText = instCode.textContent.trim();
                    const parsed = this.animationController.parser.parse(assemblyText);
                    if (parsed.valid && parsed.binary) {
                        this.updateBinaryDisplay(parsed.binary, parsed.displayName);
                    }
                }

                // Execute instruction
                await this.animationController.executeInstruction(instruction);

                // Re-enable buttons and enable replay
                this.disableButtons(false);
                this.enableReplayButton();
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
            
            // Update binary display with parsed instruction data
            if (result.parsed && result.parsed.binary) {
                this.updateBinaryDisplay(result.parsed.binary, result.parsed.displayName);
            }
            
            // Enable replay button
            this.enableReplayButton();
            
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
     * Update binary instruction display
     * @param {object} binaryData - Binary encoding data from encoder
     * @param {string} assembly - Assembly instruction text
     */
    updateBinaryDisplay(binaryData, assembly) {
        if (!binaryData) {
            this.clearBinaryDisplay();
            return;
        }

        // Update main fields
        const asmDisplay = document.getElementById('asm-display');
        const binDisplay = document.getElementById('bin-display');
        const hexDisplay = document.getElementById('hex-display');

        if (asmDisplay) asmDisplay.textContent = assembly || '-';
        if (binDisplay) binDisplay.textContent = binaryData.binaryFormatted || '---- ---- ---- ----';
        if (hexDisplay) hexDisplay.textContent = binaryData.hex || '0x----';

        // Update field breakdown
        if (binaryData.fields) {
            const opcodeBits = document.getElementById('opcode-bits');
            const opcodeName = document.getElementById('opcode-name');
            const reg1Bits = document.getElementById('reg1-bits');
            const reg1Name = document.getElementById('reg1-name');
            const reg2Bits = document.getElementById('reg2-bits');
            const reg2Name = document.getElementById('reg2-name');
            const immBits = document.getElementById('imm-bits');
            const immValue = document.getElementById('imm-value');

            if (opcodeBits) opcodeBits.textContent = binaryData.fields.opcode.binary;
            if (opcodeName) opcodeName.textContent = binaryData.fields.opcode.name;
            
            if (reg1Bits) reg1Bits.textContent = binaryData.fields.reg1.binary;
            if (reg1Name) reg1Name.textContent = binaryData.fields.reg1.name;
            
            if (reg2Bits) reg2Bits.textContent = binaryData.fields.reg2.binary;
            if (reg2Name) reg2Name.textContent = binaryData.fields.reg2.name;
            
            if (immBits) immBits.textContent = binaryData.fields.immediate.binary;
            if (immValue) immValue.textContent = binaryData.fields.immediate.value;
        }

        console.log('✓ Binary display updated:', binaryData.hex);
    }

    /**
     * Clear binary display (reset to default)
     */
    clearBinaryDisplay() {
        const asmDisplay = document.getElementById('asm-display');
        const binDisplay = document.getElementById('bin-display');
        const hexDisplay = document.getElementById('hex-display');

        if (asmDisplay) asmDisplay.textContent = '-';
        if (binDisplay) binDisplay.textContent = '---- ---- ---- ----';
        if (hexDisplay) hexDisplay.textContent = '0x----';

        // Clear breakdown
        const opcodeBits = document.getElementById('opcode-bits');
        const opcodeName = document.getElementById('opcode-name');
        const reg1Bits = document.getElementById('reg1-bits');
        const reg1Name = document.getElementById('reg1-name');
        const reg2Bits = document.getElementById('reg2-bits');
        const reg2Name = document.getElementById('reg2-name');
        const immBits = document.getElementById('imm-bits');
        const immValue = document.getElementById('imm-value');

        if (opcodeBits) opcodeBits.textContent = '----';
        if (opcodeName) opcodeName.textContent = '-';
        if (reg1Bits) reg1Bits.textContent = '--';
        if (reg1Name) reg1Name.textContent = '-';
        if (reg2Bits) reg2Bits.textContent = '--';
        if (reg2Name) reg2Name.textContent = '-';
        if (immBits) immBits.textContent = '--------';
        if (immValue) immValue.textContent = '-';
    }

    /**
     * Replay button - restarts last instruction animation
     */
    setupReplayButton() {
        const replayBtn = document.getElementById('replay-btn');

        if (replayBtn) {
            replayBtn.addEventListener('click', async () => {
                // Disable buttons during replay
                this.disableButtons(true);
                
                const result = await this.animationController.replay();
                
                // Update binary display if user instruction was replayed
                if (result.success && result.parsed && result.parsed.binary) {
                    this.updateBinaryDisplay(result.parsed.binary, result.parsed.displayName);
                }
                
                // Re-enable buttons
                this.disableButtons(false);
                this.enableReplayButton();
                
                console.log('✓ Instruction replayed');
            });
        }
    }

    /**
     * Reset button - clears registers and visual state
     */
    setupResetButton() {
        const resetBtn = document.getElementById('reset-btn');

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.animationController.reset();
                this.clearError();
                this.clearBinaryDisplay();
                this.disableReplayButton();
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

    /**
     * Enable replay button
     */
    enableReplayButton() {
        const replayBtn = document.getElementById('replay-btn');
        if (replayBtn) {
            replayBtn.disabled = false;
            replayBtn.style.opacity = '1';
            replayBtn.style.cursor = 'pointer';
        }
    }

    /**
     * Disable replay button
     */
    disableReplayButton() {
        const replayBtn = document.getElementById('replay-btn');
        if (replayBtn) {
            replayBtn.disabled = true;
            replayBtn.style.opacity = '0.5';
            replayBtn.style.cursor = 'not-allowed';
        }
    }
}
