/**
 * UI Controller
 * Handles user interactions and button events
 */

export class UI {
    constructor(animationController) {
        this.animationController = animationController;
    }

    init() {
        this.setupInstructionButtons();
        this.setupResetButton();
    }

    setupInstructionButtons() {
        const buttons = document.querySelectorAll('.instruction-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const instruction = button.dataset.instruction;
                
                // Disable all buttons during animation
                this.disableButtons(true);
                
                // Execute instruction
                await this.animationController.executeInstruction(instruction);
                
                // Re-enable buttons
                this.disableButtons(false);
            });
        });
    }

    setupResetButton() {
        const resetBtn = document.getElementById('reset-btn');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.animationController.reset();
            });
        }
    }

    disableButtons(disabled) {
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
    }
}