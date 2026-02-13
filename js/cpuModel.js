/**
 * CPU 3D Model - IMPROVED VERSION
 * Larger, centered cubes with bigger, clearer labels
 */

export class CPUModel {
    constructor(scene) {
        this.scene = scene;
        this.components = {};
        this.buses = {};

        // Responsive scale factor based on screen width - REDUCED for better fitting
        const w = window.innerWidth;

        if (w <= 480) {
            // Small phones
            this.scaleFactor = 0.3;    // Further reduced
        } else if (w <= 768) {
            // Phones / tablets portrait
            this.scaleFactor = 0.35;   // Further reduced
        } else if (w <= 1024) {
            // Tablets / small laptops
            this.scaleFactor = 0.42;   // Further reduced
        } else if (w <= 1366) {
            // Medium laptops
            this.scaleFactor = 0.65;   // Increased to make blocks bigger
        } else {
            // Large screens
            this.scaleFactor = 0.80;   // Increased to make blocks bigger
        }

        // Responsive positioning - CENTER properly to avoid collisions
        if (w <= 768) {
            // Mobile: center the model, PUSHED UP MAX for gap and visibility
            this.xOffset = 0.0;        // Centered
            this.baseY = 1.25;         // INCREASED to 1.25 to make room for memory gap
        } else {
            // Desktop: AGGRESSIVE shift to the empty left side
            // Move LEFT even further (-3.5) to use all that empty space
            // Move DOWN far (-1.2) to clear the top Ready box with larger blocks
            this.xOffset = -3.9;
            this.baseY = -1.6;
        }

        // Horizontal spacing factor: 1.1 for desktop (wide), 1.0 for mobile (standard)
        this.spacingX = (w <= 768) ? 1.0 : 1.1;
    }

    build() {
        this.buildProgramCounter(this.baseY);
        this.buildInstructionRegister(this.baseY);
        this.buildMemoryAddressRegister(this.baseY);
        this.buildMemoryDataRegister(this.baseY);
        this.buildControlUnit(this.baseY);
        this.buildRegisterFile(this.baseY);
        this.buildALU(this.baseY);
        this.buildMemory(this.baseY);
        this.buildBuses();
    }

    createLabeledTexture(label, color, width = 1024, height = 1024, outlineColor = '#FFFFFF') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        // Background with gradient for better visibility
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, this.colorToHex(color));
        gradient.addColorStop(1, this.adjustBrightness(color, -20));
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Dynamic font size based on label length
        // Short labels (PC, IR, CU) get MASSIVE text
        // 3-char labels (MEM, MDR, MAR, ALU) get mid-sized text
        let fontScale = 0.55;
        if (label.length === 3) {
            fontScale = 0.45; // Increased from 0.28 for better mobile clarity
        } else if (label.length > 3) {
            fontScale = 0.28; // Reduced for 4+ chars to prevent overflow
        }

        const fontSize = Math.floor(width * fontScale);
        context.font = `900 ${fontSize}px Arial, sans-serif`; // Weight 900

        // High contrast text strategy: Solid Black + Smart Outline
        context.fillStyle = '#000000';      // Pure Black Text
        context.strokeStyle = outlineColor; // Custom Outline

        // Smart Thickness: 
        // If Black Outline (Bolding): Use THIN (0.02) to avoid blobbiness
        // If White Outline (Halo): Use THICK (0.06) for separation
        const isBlackOutline = (outlineColor === '#000000');
        context.lineWidth = fontSize * (isBlackOutline ? 0.02 : 0.06);

        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Draw text
        context.strokeText(label, canvas.width / 2, canvas.height / 2);
        context.fillText(label, canvas.width / 2, canvas.height / 2);

        // Border
        context.strokeStyle = '#000000';
        context.lineWidth = 40; // Thicker border
        context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        return new THREE.CanvasTexture(canvas);
    }

    adjustBrightness(color, percent) {
        const r = Math.max(0, Math.min(255, ((color >> 16) & 0xff) + percent));
        const g = Math.max(0, Math.min(255, ((color >> 8) & 0xff) + percent));
        const b = Math.max(0, Math.min(255, (color & 0xff) + percent));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    colorToHex(color) {
        return '#' + color.toString(16).padStart(6, '0');
    }

    buildProgramCounter(baseY) {
        // PERFECTLY SQUARE cube
        const size = 0.28 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);

        // PC gets NORMAL text (No black outline)
        const texture = this.createLabeledTexture('PC', 0x00CCFF);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x003344,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const pc = new THREE.Mesh(geometry, materials);
        pc.position.set(
            (this.xOffset - this.spacingX) * this.scaleFactor,
            baseY + 1.5 * this.scaleFactor,
            0
        );
        pc.userData.name = 'PC';

        this.scene.add(pc);
        this.components.PC = pc;
    }

    buildInstructionRegister(baseY) {
        // PERFECTLY SQUARE cube
        const size = 0.30 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);

        const texture = this.createLabeledTexture('IR', 0x4466FF);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x001144,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const ir = new THREE.Mesh(geometry, materials);
        ir.position.set(
            (this.xOffset - this.spacingX) * this.scaleFactor,
            baseY + 1.0 * this.scaleFactor,
            0
        );
        ir.userData.name = 'IR';

        this.scene.add(ir);
        this.components.IR = ir;
    }

    buildMemoryAddressRegister(baseY) {
        // WIDER RECTANGLE for MAR (25% wider)
        const size = 0.26 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size * 1.25, size, size);

        // MAR gets NORMAL text (No black outline)
        const texture = this.createLabeledTexture('MAR', 0xFF7700, 1280, 1024);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x442200,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const mar = new THREE.Mesh(geometry, materials);
        mar.position.set(
            (this.xOffset - this.spacingX) * this.scaleFactor,
            baseY + 0.5 * this.scaleFactor,
            0
        );
        mar.userData.name = 'MAR';

        this.scene.add(mar);
        this.components.MAR = mar;
    }

    buildMemoryDataRegister(baseY) {
        // WIDER RECTANGLE for MDR (25% wider)
        const size = 0.26 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size * 1.25, size, size);

        // MDR gets NORMAL text (No black outline)
        const texture = this.createLabeledTexture('MDR', 0xFF4477, 1280, 1024);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x441122,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const mdr = new THREE.Mesh(geometry, materials);
        mdr.position.set(
            (this.xOffset - this.spacingX) * this.scaleFactor,
            baseY + 0.0 * this.scaleFactor,
            0
        );
        mdr.userData.name = 'MDR';

        this.scene.add(mdr);
        this.components.MDR = mdr;
    }

    buildControlUnit(baseY) {
        // PERFECTLY SQUARE cube - slightly larger for importance
        const size = 0.38 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);

        const texture = this.createLabeledTexture('CU', 0xFFAA00);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x442200,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const cu = new THREE.Mesh(geometry, materials);
        cu.position.set(
            this.xOffset * this.scaleFactor,
            baseY + 1.0 * this.scaleFactor,
            0
        );
        cu.userData.name = 'CU';

        this.scene.add(cu);
        this.components.CU = cu;
    }

    buildRegisterFile(baseY) {
        const registerGroup = new THREE.Group();
        registerGroup.position.set(
            (this.xOffset + this.spacingX) * this.scaleFactor,
            baseY + 0.5 * this.scaleFactor,
            0
        );

        // Storage for value meshes to update later
        this.valueDisplays = {};

        const registers = ['R0', 'R1', 'R2', 'R3'];
        const regSize = 0.22 * this.scaleFactor;

        registers.forEach((regName, index) => {
            // PERFECTLY SQUARE cubes for registers
            const geometry = new THREE.BoxGeometry(regSize, regSize, regSize);

            const texture = this.createLabeledTexture(regName, 0x00FF00);
            const materials = Array(6).fill(null).map(() =>
                new THREE.MeshStandardMaterial({
                    map: texture,
                    emissive: 0x004400,
                    emissiveIntensity: 0.4,
                    metalness: 0.6,
                    roughness: 0.4
                })
            );

            const register = new THREE.Mesh(geometry, materials);
            register.position.y = index * 0.30 * this.scaleFactor;
            register.userData.name = regName;

            registerGroup.add(register);
            this.components[regName] = register;

            // --- LARGER VALUE DISPLAY BOX ---
            const valSize = 0.22 * this.scaleFactor; // Match register size
            const valGeo = new THREE.BoxGeometry(valSize, valSize, valSize * 0.5);

            // Default value '0'
            const valTex = this.createValueTexture('0');
            const valMat = new THREE.MeshBasicMaterial({ map: valTex, color: 0xffffff });
            const valMesh = new THREE.Mesh(valGeo, valMat);

            // Position it to the right of the register (further away to avoid overlap)
            valMesh.position.set(
                0.45 * this.scaleFactor, // x offset from register center (increased from 0.30)
                index * 0.30 * this.scaleFactor, // same Y as register
                0.08 * this.scaleFactor // slightly in front
            );

            registerGroup.add(valMesh);
            this.valueDisplays[regName] = valMesh;
        });

        this.scene.add(registerGroup);
        this.components.RegisterFile = registerGroup;
    }

    createValueTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512; // Doubled resolution
        canvas.height = 512;

        // Pure white background for max contrast
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Thick black border
        context.strokeStyle = '#000000';
        context.lineWidth = 30;
        context.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

        // MASSIVE high-contrast text
        context.font = '900 320px Arial, sans-serif';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText(text, canvas.width / 2, canvas.height / 2);

        return new THREE.CanvasTexture(canvas);
    }

    updateRegisterDisplay(regName, value) {
        const mesh = this.valueDisplays[regName];
        if (mesh) {
            mesh.material.map = this.createValueTexture(value.toString());
            mesh.material.needsUpdate = true;
        }
    }

    buildALU(baseY) {
        // PERFECTLY SQUARE cube with label (like other components)
        const size = 0.35 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size*1.5, size*1.25, size);

        // ALU gets NORMAL text (No black outline)
        const texture = this.createLabeledTexture('ALU', 0xFF0000);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x440000,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const alu = new THREE.Mesh(geometry, materials);
        alu.position.set(
            this.xOffset * this.scaleFactor, // Centered column uses xOffset directly
            baseY + 0.2 * this.scaleFactor,
            0
        );
        alu.userData.name = 'ALU';

        this.scene.add(alu);
        this.components.ALU = alu;
    }

    buildMemory(baseY) {
        // Reduced height even more to avoid bottom panel
        const size = 0.55 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(
            size * 0.8,
            size * 1.25, // REDUCED from 1.0 to 0.75 for safety
            size * 0.3
        );

        // HD Texture (1024x1024) with default high contrast text
        const texture = this.createLabeledTexture('MEM', 0xAA00FF, 1024, 1024);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x330044,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const memory = new THREE.Mesh(geometry, materials);

        // Mobile needs memory gap; moved higher (baseY 1.25 handles height)
        const memoryYOffset = (window.innerWidth <= 768) ? -0.85 : -0.7;

        memory.position.set(
            (this.xOffset - this.spacingX) * this.scaleFactor,
            baseY + (memoryYOffset * this.scaleFactor),
            0
        );
        memory.userData.name = 'Memory';

        this.scene.add(memory);
        this.components.Memory = memory;
    }

    createTextSprite(text, backgroundColor) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = 512;
        canvas.height = 256;

        // Background
        context.fillStyle = this.colorToHex(backgroundColor);
        context.fillRect(0, 0, canvas.width, canvas.height);

        // LARGER text
        context.font = 'Bold 120px Arial';
        context.fillStyle = '#FFFFFF';
        context.strokeStyle = '#000000';
        context.lineWidth = 10;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Border
        context.strokeStyle = '#000000';
        context.lineWidth = 12;
        context.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    }

    buildBuses() {
        // Match bus length to the actual model width (Left column to Right registers)
        const leftX = (this.xOffset - this.spacingX - 0.2) * this.scaleFactor;
        const rightX = (this.xOffset + this.spacingX + 0.7) * this.scaleFactor; // Extra on right for register values

        // Dynamic bus Y: Place them below the lowest component (Memory)
        const memoryYOffset = (window.innerWidth <= 768) ? -0.85 : -0.7;
        const busY = this.baseY + (memoryYOffset - 0.4) * this.scaleFactor;

        this.buses.dataBus = this.createBus(
            new THREE.Vector3(leftX, busY, -0.3 * this.scaleFactor),
            new THREE.Vector3(rightX, busY, -0.3 * this.scaleFactor),
            0x00FF00
        );

        this.buses.addressBus = this.createBus(
            new THREE.Vector3(leftX, busY, 0),
            new THREE.Vector3(rightX, busY, 0),
            0x0000FF
        );

        this.buses.controlBus = this.createBus(
            new THREE.Vector3(leftX, busY, 0.3 * this.scaleFactor),
            new THREE.Vector3(rightX, busY, 0.3 * this.scaleFactor),
            0xFFFF00
        );
    }

    createBus(start, end, color) {
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 3,
            transparent: true,
            opacity: 0.6
        });
        const bus = new THREE.Line(geometry, material);
        this.scene.add(bus);
        return bus;
    }

    highlightComponent(componentName, color = 0x00FFFF) {
        const component = this.components[componentName];
        if (!component) return;

        if (Array.isArray(component.material)) {
            component.material.forEach(mat => {
                if (!mat.userData.originalEmissive)
                    mat.userData.originalEmissive = mat.emissive.getHex();
                mat.emissive.setHex(color);
                mat.emissiveIntensity = 2.0; // Brighter highlight
            });
        } else {
            if (!component.material.userData.originalEmissive)
                component.material.userData.originalEmissive = component.material.emissive.getHex();
            component.material.emissive.setHex(color);
            component.material.emissiveIntensity = 2.0;
        }
    }

    resetComponent(componentName) {
        const component = this.components[componentName];
        if (!component) return;

        if (Array.isArray(component.material)) {
            component.material.forEach(mat => {
                if (mat.userData.originalEmissive !== undefined) {
                    mat.emissive.setHex(mat.userData.originalEmissive);
                    mat.emissiveIntensity = 0.4;
                }
            });
        } else {
            if (component.material.userData.originalEmissive !== undefined) {
                component.material.emissive.setHex(component.material.userData.originalEmissive);
                component.material.emissiveIntensity = 0.4;
            }
        }
    }

    resetAll() {
        Object.keys(this.components).forEach(name => {
            if (name !== 'RegisterFile') this.resetComponent(name);
        });
    }
}